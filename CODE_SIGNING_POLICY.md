# Code signing policy

AppForge is applying for the SignPath Foundation open-source code-signing program.

**Free code signing provided by SignPath.io, certificate by SignPath Foundation.**

No AppForge release is represented as SignPath-signed until SignPath Foundation has accepted the project and that release has actually received a valid signature.

## Team roles

AppForge currently has one project maintainer.

- Committer and reviewer: `eliron8565`
- Signing approver: `eliron8565`

External contributions must be reviewed by the project maintainer before they are merged. Release signing requests require approval by the signing approver as required by the SignPath Foundation program.

## Build and signing rules

- AppForge release artifacts are built from the public source code and build configuration in `eliron8565/beder-then-ninite`.
- The Windows build is produced using GitHub Actions.
- Only AppForge artifacts produced from AppForge's source and build scripts may be submitted for AppForge signing.
- Third-party applications installed by AppForge are not signed with the AppForge signing certificate.
- Product metadata uses the AppForge product name and a consistent product version for each build.
- Signed releases will use SignPath's trusted-build/origin-verification requirements.
- A release will not be described as signed unless its signature is valid.

## Privacy

See [PRIVACY.md](PRIVACY.md).

AppForge does not intentionally transfer personal information to AppForge-controlled network systems. Network access is used for functionality specifically requested by the user, such as retrieving application information/icons, downloading AppForge, opening official vendor pages, and installing selected software through supported package services.

## System changes and removal

AppForge makes installation changes only after the user selects applications and starts installation. Installed third-party applications can be removed through the operating system's normal application-management/uninstallation facilities.

## Security

AppForge is intended to simplify legitimate software installation. It is not intended to bypass operating-system security controls. Security issues should be reported to the project maintainer through the GitHub repository.