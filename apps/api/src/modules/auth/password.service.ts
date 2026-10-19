import {
  argon2Verify,
  argon2id,
  setWASMModules,
} from "argon2-wasm-edge";
import argon2WASM from "argon2-wasm-edge/wasm/argon2.wasm.json";
import blake2bWASM from "argon2-wasm-edge/wasm/blake2b.wasm.json";

const DECOY_PASSWORD = "invalid-password-placeholder";

// The native `argon2` package depends on Node-only globals such as `__dirname`
// and cannot be bundled for Cloudflare Workers. The WASM modules work in both
// the local Node runtime and Workers, while preserving standard Argon2 hashes.
const wasmModuleFromJson = (source: { data: string }): WebAssembly.Module => {
  const binary = Uint8Array.from(atob(source.data), (character) =>
    character.charCodeAt(0),
  );
  return new WebAssembly.Module(binary);
};

void setWASMModules({
  argon2WASM: wasmModuleFromJson(argon2WASM),
  blake2bWASM: wasmModuleFromJson(blake2bWASM),
});

export class PasswordService {
  private decoyHash: string | null = null;

  async hash(password: string): Promise<string> {
    const salt = new Uint8Array(16);
    crypto.getRandomValues(salt);

    return argon2id({
      password,
      salt,
      parallelism: 1,
      iterations: 2,
      memorySize: 19_456,
      hashLength: 32,
      outputType: "encoded",
    });
  }

  async verify(passwordHash: string, password: string): Promise<boolean> {
    return argon2Verify({ hash: passwordHash, password });
  }
  async verifyDecoy(password: string): Promise<false> {
    this.decoyHash ??= await this.hash(DECOY_PASSWORD);
    await this.verify(this.decoyHash, password).catch(() => false);
    return false;
  }
}
