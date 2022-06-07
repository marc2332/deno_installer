## 📦 Port of [tauri-bundler](https://github.com/tauri-apps/tauri/tree/dev/tooling/bundler)

You can now easily create installers for your Deno apps, thanks to the amazing
work of [Tauri](https://github.com/tauri-apps/tauri/tree/dev/tooling/bundler) 💪

- Windows: `MSI`
- Linux: `Debian package`, `AppImage`
- MacOS: `DMG`

That beind said, feel free to contribute. If you have any feature idea see
[Contributing](#Contributing) :)

## Demo

Before making the installer make sure you have your project as:

```
+-- MyAppExecutable (.exe if in Windows)
+-- icons
|   +-- icon.ico (Windows)
|   +-- icon.png (MacOS)
|   +-- (See note for Linux)
``` 

> Note: For **Linux** you will also need some special [icons](https://github.com/marc2332/deno_installer/tree/main/examples/oak/icons).

Create a file `build.ts`, paste and modify as you wish:

```ts
import { Installer } from "https://deno.land/x/installer/mod.ts";

const installer = new Installer({
  out_path: `${Deno.cwd()}/dist`,
  src_path: `${Deno.cwd()}/MyAppExecutable${
    Deno.build.os === "windows" ? ".exe" : ""
  }`,
  package: {
    product_name: "MyApp",
    version: "1.0.0",
    description: "App made by a denosaur",
    homepage: "https://github.com/marc2332/deno_installer",
    authors: ["Denosaur"],
    default_run: "MyApp",
  },
  bundle: {
    identifier: "my.deno.app",
    icon: [
      "examples/oak/icons/32x32.png",
      "examples/oak/icons/128x128.png",
      "examples/oak/icons/128x128@2x.png",
      "examples/oak/icons/icon.icns",
      "examples/oak/icons/icon.ico",
    ], // It will look under /icons if the array is empty
    resources: [], // Not tested
    copyright: "2022",
    short_description: "Short description!",
    long_description: "Looooooooooong description!",
  },
});

await installer.createInstaller();
```

Run:

```shell
deno run -A --unstable build.ts
```

The installer path will be printed out.

## Contributing

Requisites:

- cargo
- [deno_bindgen](https://github.com/denoland/deno_bindgen)
- deno

Build the plugin:

```shell
deno_bindgen
```

Create a installer from the demo app:

```shell
cd examples/oak
deno compile app.ts
deno run -A --unstable build.ts
```
