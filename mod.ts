import { create_installer, InstallerSettings } from "./bindings/bindings.ts";

export class Installer {
  settings: InstallerSettings;

  constructor(settings: InstallerSettings) {
    this.settings = settings;
  }

  async createInstaller() {
    await Deno.mkdir(this.settings.out_path, { recursive: true });
    await Deno.copyFile(
      this.settings.src_path,
      `${this.settings.out_path}/${this.settings.package.product_name}${
        Deno.build.os === "windows" ? ".exe" : ""
      }`,
    );
    await create_installer(this.settings);
  }
}
