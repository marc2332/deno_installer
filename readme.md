## 📦 Port of [tauri-bundler](https://github.com/tauri-apps/tauri/tree/dev/tooling/bundler)

You can now easily create installers for your Deno apps, thanks to the amazing work of [Tauri](https://github.com/tauri-apps/tauri/tree/dev/tooling/bundler) 💪

IMPORTANT note: the code is very **meh**

That beind said, feel free to contribute, it only supports **Windows** at the moment (that's the only one I have tested with). If you are a MacOS or Linux user I would appreciate some feedback! See [Contributing](#Contributing) if that's the case!

## Demo

Before making the installer make sure you have your project as:

```
+-- MyApp.exe
+-- icons
|   +-- icon.ico (Windows)
|   +-- icon.png (MacOS & Linux)
```

Create a file `build.ts`, paste and modify as you wish:

```ts
import { Installer } from "https://deno.land/x/installer/mod.ts";

const installer = new Installer({
    out_path: `${Deno.cwd()}/dist`,
    src_path: `${Deno.cwd()}/MyApp.exe`,
    package: {
        product_name: "MyApp",
        version: "1.0.0",
        description: "App made by a denosaur",
        homepage: "https://github.com/marc2332/deno_installer",
        authors: ["Denosaur"],
        default_run: "MyApp"
    },
    bundle: {
        identifier: "my.deno.app",
        icon: [], // It will look under /icons if empty
        resources: [], // Not tested
        copyright: "2022",
        short_description: "Short description!",
        long_description: "Looooooooooong description!"
    }
})

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
