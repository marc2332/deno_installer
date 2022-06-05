use deno_bindgen::deno_bindgen;
use tauri_bundler::{
    bundle_project, BundleBinary, BundleSettings, PackageSettings, SettingsBuilder,
};

// NOTE: Having a duplicate struct for the package and bundle settings is not a good idea

#[deno_bindgen]
struct PackageSettingsInstaller {
    product_name: String,
    version: String,
    description: String,
    homepage: Option<String>,
    authors: Option<Vec<String>>,
    default_run: Option<String>,
}

#[deno_bindgen]
pub struct BundleSettingsInstaller {
    pub identifier: Option<String>,
    pub icon: Option<Vec<String>>,
    pub resources: Option<Vec<String>>,
    pub copyright: Option<String>,
    pub short_description: Option<String>,
    pub long_description: Option<String>,
}

#[deno_bindgen]
pub struct InstallerSettings {
    src_path: String,
    out_path: String,
    bundle: BundleSettingsInstaller,
    package: PackageSettingsInstaller,
}

fn adapt_package(custom_package: PackageSettingsInstaller) -> PackageSettings {
    PackageSettings {
        product_name: custom_package.product_name,
        version: custom_package.version,
        description: custom_package.description,
        homepage: custom_package.homepage,
        authors: custom_package.authors,
        default_run: custom_package.default_run,
    }
}

fn adapt_bundle(custom_bundle: BundleSettingsInstaller) -> BundleSettings {
    let mut bundle = BundleSettings::default();

    bundle.identifier = custom_bundle.identifier;
    bundle.icon = custom_bundle.icon;
    bundle.resources = custom_bundle.resources;
    bundle.copyright = custom_bundle.copyright;
    bundle.short_description = custom_bundle.short_description;
    bundle.long_description = custom_bundle.long_description;

    #[cfg(windows)]
    if let Some(icon) = &bundle.icon {
        if icon.len() > 0 {
            use std::path::PathBuf;
            bundle.windows.icon_path = PathBuf::from(
                icon.iter()
                    .find(|i| i.ends_with(".ico"))
                    .cloned()
                    .expect("the bundle config must have a `.ico` icon"),
            );
        }
    }

    bundle
}

#[deno_bindgen]
fn create_installer(installer_settings: InstallerSettings) {
    let bundle = BundleBinary::new(installer_settings.package.product_name.clone(), true)
        .set_src_path(Some(installer_settings.src_path));
    let bundle_settings = adapt_bundle(installer_settings.bundle);
    let package_settings = adapt_package(installer_settings.package);

    let builder = SettingsBuilder::new()
        .bundle_settings(bundle_settings)
        .package_settings(package_settings)
        .project_out_directory(installer_settings.out_path)
        .binaries(vec![bundle]);

    let settings = builder.build().unwrap();

    match bundle_project(settings) {
        Ok(_) => {
            println!("Installer created");
        }
        Err(e) => {
            println!("{:?}", e);
        }
    }
}
