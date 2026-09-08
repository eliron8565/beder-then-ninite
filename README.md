# AppForge

AppForge is an open-source application installer that lets users select the applications they want and download one installer for their selection.

Website: https://eliron8565.github.io/beder-then-ninite/

## Features

- Searchable application catalog
- Category filters and quick presets
- Select multiple applications on the website
- Native installer workflow for supported operating systems
- Windows installation through trusted package sources such as Winget where available
- Official vendor download pages for applications that require manual vendor installation
- Public source code and automated GitHub Actions builds

## Downloads

Use the AppForge website to select the applications you want and download the installer:

https://eliron8565.github.io/beder-then-ninite/

## Code signing policy

AppForge is applying for the SignPath Foundation open-source code-signing program.

**Free code signing provided by SignPath.io, certificate by SignPath Foundation.**

No AppForge release is represented as SignPath-signed until SignPath Foundation has accepted the project and the individual release has actually received a valid signature.

See [CODE_SIGNING_POLICY.md](CODE_SIGNING_POLICY.md) for the complete policy, including project roles, trusted builds, release approval and privacy information.

## Privacy

See [PRIVACY.md](PRIVACY.md).

AppForge does not operate an AppForge account service and does not intentionally collect or sell personal information. Network access is used for functionality requested by the user, including retrieving application information/icons, downloading AppForge, opening official vendor pages, and installing selected applications through supported package services.

## Uninstallation

AppForge itself is a standalone installer and does not require a traditional installation. The third-party applications installed through AppForge can be removed using the operating system's normal Apps/Installed Apps or package-management facilities.

## License

AppForge is released under the [MIT License](LICENSE).

## Development

The source code and build configuration are public in this repository. Windows release builds are produced with GitHub Actions.

The project is independent and is not affiliated with Ninite, Microsoft, or the third-party applications listed in its catalog.