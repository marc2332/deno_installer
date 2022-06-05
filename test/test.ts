import { assert } from "https://deno.land/std@0.139.0/_util/assert.ts";
import { Installer } from "../mod.ts";

const installer = new Installer({
  out_path: `${Deno.cwd()}/test/dist`,
  src_path: `${Deno.cwd()}/test/app${
    Deno.build.os === "windows" ? ".exe" : ""
  }`,
  package: {
    product_name: "TestApp",
    version: "1.0.0",
    description: "woooow",
    homepage: "https://github.com/marc2332",
    authors: ["Marc Espín"],
    default_run: "TestApp",
  },
  bundle: {
    identifier: "my.deno.app",
    icon: [
      "examples/oak/icons/32x32.png",
      "examples/oak/icons/128x128.png",
      "examples/oak/icons/128x128@2x.png",
      "examples/oak/icons/icon.icns",
      "examples/oak/icons/icon.ico",
    ],
    resources: [],
    copyright: "",
    short_description: "",
    long_description: "",
  },
});

async function compileExampleApp() {
  const p = Deno.run({
    cmd: [
      "deno",
      "compile",
      "--output",
      `test/app${Deno.build.os === "windows" ? ".exe" : ""}`,
      "test/app.ts",
    ],
  });
  await p.status();
  p.close();
}

Deno.test(`Installer created ${Deno.build.os}`, async () => {
  await compileExampleApp();

  await installer.createInstaller();

  const dist = `${Deno.cwd()}/test/dist/bundle`;

  switch (Deno.build.os) {
    case "windows":
      {
        let exists = true;
        try {
          // Check Windows installer
          await Deno.readFile(
            `${dist}/msi/TestApp_1.0.0_x64_en-US.msi`,
          );
        } catch {
          exists = false;
        }
        assert(exists);
      }
      break;
    case "linux":
      {
        let exists = true;
        try {
          // Check Debian installer
          await Deno.readFile(
            `${dist}/deb/TestApp_1.0.0_amd64.deb`,
          );
          // Check AppImage installer
          await Deno.readFile(
            `${dist}/appimage/TestApp_1.0.0_amd64.AppImage`,
          );
        } catch {
          exists = false;
        }
        assert(exists);
      }
      break;

    case "darwin":
      {
        let exists = true;
        try {
          // Check MacOS installer
          await Deno.readFile(
            `${dist}/dmg/TestApp_1.0.0_x64.dmg`,
          );
        } catch {
          exists = false;
        }
        assert(exists);
      }
      break;
  }
});
