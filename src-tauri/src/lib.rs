use std::fs::{self, File};
use std::io::Write;
use std::path::{Path, PathBuf};

#[tauri::command]
fn read_text_file(path: String) -> Result<String, String> {
    fs::read_to_string(Path::new(&path)).map_err(|error| error.to_string())
}

fn sibling_path(target: &Path, suffix: &str) -> Result<PathBuf, String> {
    let parent = target
        .parent()
        .ok_or_else(|| "Cannot determine the parent directory for this file.".to_string())?;
    let file_name = target
        .file_name()
        .and_then(|name| name.to_str())
        .ok_or_else(|| "Invalid file name.".to_string())?;
    Ok(parent.join(format!(".{file_name}.{suffix}")))
}

#[tauri::command]
fn write_text_file(path: String, content: String) -> Result<(), String> {
    let target = Path::new(&path);
    if let Some(parent) = target.parent() {
        fs::create_dir_all(parent).map_err(|error| error.to_string())?;
    }

    let temp = sibling_path(target, "quill.tmp")?;
    {
        let mut file = File::create(&temp).map_err(|error| error.to_string())?;
        file.write_all(content.as_bytes())
            .map_err(|error| error.to_string())?;
        file.sync_all().map_err(|error| error.to_string())?;
    }

    #[cfg(not(windows))]
    {
        fs::rename(&temp, target).map_err(|error| error.to_string())?;
    }

    #[cfg(windows)]
    {
        if target.exists() {
            let backup = sibling_path(target, "quill.bak")?;
            if backup.exists() {
                fs::remove_file(&backup).map_err(|error| error.to_string())?;
            }

            fs::rename(target, &backup).map_err(|error| error.to_string())?;

            if let Err(error) = fs::rename(&temp, target) {
                let _ = fs::rename(&backup, target);
                return Err(error.to_string());
            }

            let _ = fs::remove_file(&backup);
        } else {
            fs::rename(&temp, target).map_err(|error| error.to_string())?;
        }
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![read_text_file, write_text_file])
        .run(tauri::generate_context!())
        .expect("error while running Quill");
}
