import { Installer } from "../../mod.ts";

const installer = new Installer({
  out_path: `${Deno.cwd()}/dist`,
  src_path: `${Deno.cwd()}/app${Deno.build.os === "windows" ? ".exe" : ""}`,
  package: {
    product_name: "MyApp",
    version: "1.0.0",
    description: "woooow",
    homepage: "https://github.com/marc2332",
    authors: ["Marc Espín"],
    default_run: "MyApp",
  },
  bundle: {
    identifier: "my.deno.app",
    icon: [],
    resources: [],
    copyright: "2022",
    short_description: "wooooow2",
    long_description: "wooooow2",
  },
});

await installer.createInstaller();
