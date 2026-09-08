using System.Diagnostics;

namespace AppForgeInstaller;

internal static class Program
{
    [STAThread]
    static void Main()
    {
        ApplicationConfiguration.Initialize();
        Application.Run(new MainForm());
    }
}

internal sealed class MainForm : Form
{
    private readonly FlowLayoutPanel appList = new();
    private readonly ProgressBar progress = new();
    private readonly Label status = new();
    private readonly Button installButton = new();
    private readonly List<AppItem> selectedApps;
    private static readonly HttpClient Http = new() { Timeout = TimeSpan.FromSeconds(8) };
    private static string Fav(string domain) => $"https://www.google.com/s2/favicons?domain={domain}&sz=128";

    private static readonly AppItem[] Catalog =
    {
        A(0,"Google Chrome","Google.Chrome","google.com"), A(1,"Mozilla Firefox","Mozilla.Firefox","mozilla.org"), A(2,"Microsoft Edge","Microsoft.Edge","microsoft.com"), A(3,"Brave","Brave.Brave","brave.com"), A(4,"Opera","Opera.Opera","opera.com"), A(5,"Vivaldi","Vivaldi.Vivaldi","vivaldi.com"),
        A(6,"Discord","Discord.Discord","discord.com"), A(7,"Telegram","Telegram.TelegramDesktop","telegram.org"), A(8,"Slack","SlackTechnologies.Slack","slack.com"), A(9,"Zoom","Zoom.Zoom","zoom.us"), A(10,"Microsoft Teams","Microsoft.Teams","microsoft.com"),
        A(11,"Steam","Valve.Steam","steampowered.com"), A(12,"Epic Games Launcher","EpicGames.EpicGamesLauncher","epicgames.com"), A(13,"Prism Launcher","PrismLauncher.PrismLauncher","prismlauncher.org"), A(14,"Heroic Games Launcher","HeroicGamesLauncher.HeroicGamesLauncher","heroicgameslauncher.com"),
        A(15,"VLC media player","VideoLAN.VLC","videolan.org"), A(16,"Spotify","Spotify.Spotify","spotify.com"), A(17,"OBS Studio","OBSProject.OBSStudio","obsproject.com"), A(18,"Audacity","Audacity.Audacity","audacityteam.org"), A(19,"HandBrake","HandBrake.HandBrake","handbrake.fr"),
        A(20,"Visual Studio Code","Microsoft.VisualStudioCode","code.visualstudio.com"), A(21,"Git","Git.Git","git-scm.com"), A(22,"GitHub Desktop","GitHub.GitHubDesktop","desktop.github.com"), A(23,"Python 3","Python.Python.3.13","python.org"), A(24,"Node.js LTS","OpenJS.NodeJS.LTS","nodejs.org"), A(25,"Docker Desktop","Docker.DockerDesktop","docker.com"), A(26,"Postman","Postman.Postman","postman.com"), A(27,"PyCharm Community","JetBrains.PyCharm.Community","jetbrains.com"), A(28,"IntelliJ IDEA Community","JetBrains.IntelliJIDEA.Community","jetbrains.com"), A(29,"Notepad++","Notepad++.Notepad++","notepad-plus-plus.org"), A(30,"Cisco Packet Tracer","url:https://www.netacad.com/learning-collections/cisco-packet-tracer","cisco.com"), A(31,"Blockbench","JannisX11.Blockbench","blockbench.net"),
        A(32,"LibreOffice","TheDocumentFoundation.LibreOffice","libreoffice.org"), A(33,"Obsidian","Obsidian.Obsidian","obsidian.md"), A(34,"Thunderbird","Mozilla.Thunderbird","thunderbird.net"),
        A(35,"Krita","KDE.Krita","krita.org"), A(36,"GIMP","GIMP.GIMP.3","gimp.org"), A(37,"Blender","BlenderFoundation.Blender","blender.org"), A(38,"Inkscape","Inkscape.Inkscape","inkscape.org"), A(39,"ShareX","ShareX.ShareX","getsharex.com"),
        A(40,"7-Zip","7zip.7zip","7-zip.org"), A(41,"PeaZip","Giorgiotani.Peazip","peazip.github.io"), A(42,"WinRAR","RARLab.WinRAR","rarlab.com"),
        A(43,"qBittorrent","qBittorrent.qBittorrent","qbittorrent.org"), A(44,"FileZilla","TimKosse.FileZilla.Client","filezilla-project.org"), A(45,"WinSCP","WinSCP.WinSCP","winscp.net"),
        A(46,"Bitwarden","Bitwarden.Bitwarden","bitwarden.com"), A(47,"KeePassXC","KeePassXCTeam.KeePassXC","keepassxc.org"), A(48,"Malwarebytes","Malwarebytes.Malwarebytes","malwarebytes.com"),
        A(49,"PowerToys","Microsoft.PowerToys","microsoft.com"), A(50,"Everything","voidtools.Everything","voidtools.com"), A(51,"WizTree","AntibodySoftware.WizTree","diskanalyzer.com"), A(52,"Rufus","Rufus.Rufus","rufus.ie"), A(53,"balenaEtcher","Balena.Etcher","balena.io"), A(54,"MiniTool Partition Wizard","MiniTool.PartitionWizard.Free","partitionwizard.com"), A(55,"HWiNFO","REALiX.HWiNFO","hwinfo.com"), A(56,"CPU-Z","CPUID.CPU-Z","cpuid.com"), A(57,"CrystalDiskInfo","CrystalDewWorld.CrystalDiskInfo","crystalmark.info"), A(58,"AnyDesk","AnyDeskSoftwareGmbH.AnyDesk","anydesk.com"), A(59,"TeamViewer","TeamViewer.TeamViewer","teamviewer.com"), A(60,"PuTTY","PuTTY.PuTTY","putty.org"), A(61,"RustDesk","RustDesk.RustDesk","rustdesk.com"),
        A(62,"Visual C++ Redistributable 2015–2022 x64","Microsoft.VCRedist.2015+.x64","microsoft.com"), A(63,".NET Desktop Runtime 8","Microsoft.DotNet.DesktopRuntime.8","dotnet.microsoft.com"), A(64,"Java 21 (Temurin JDK)","EclipseAdoptium.Temurin.21.JDK","adoptium.net"), A(65,"Java 17 (Temurin JDK)","EclipseAdoptium.Temurin.17.JDK","adoptium.net"),
        A(66,"NVIDIA Graphics Drivers","url:https://www.nvidia.com/Download/index.aspx","nvidia.com"), A(67,"NVIDIA App","url:https://www.nvidia.com/en-us/software/nvidia-app/","nvidia.com"), A(68,"AMD Radeon Drivers","url:https://www.amd.com/en/support/download/drivers.html","amd.com"), A(69,"AMD Software: Adrenalin Edition","url:https://www.amd.com/en/products/software/adrenalin.html","amd.com")
    };

    private static AppItem A(int index, string name, string packageId, string domain) => new(index, name, packageId, Fav(domain));

    public MainForm()
    {
        selectedApps = ReadSelectionFromFilename();
        Text = "AppForge Installer";
        StartPosition = FormStartPosition.CenterScreen;
        MinimumSize = new Size(780, 580);
        Size = new Size(980, 720);
        BackColor = Color.FromArgb(6, 16, 29);
        ForeColor = Color.White;
        Font = new Font("Segoe UI", 10f);
        Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath);
        BuildUi();
    }

    private void BuildUi()
    {
        var root = new TableLayoutPanel { Dock = DockStyle.Fill, Padding = new Padding(26), RowCount = 5, ColumnCount = 1, BackColor = BackColor };
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize)); root.RowStyles.Add(new RowStyle(SizeType.AutoSize)); root.RowStyles.Add(new RowStyle(SizeType.Percent, 100)); root.RowStyles.Add(new RowStyle(SizeType.AutoSize)); root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        Controls.Add(root);

        root.Controls.Add(new Label { AutoSize = true, Text = "AppForge", Font = new Font("Segoe UI", 28, FontStyle.Bold), ForeColor = Color.White, Margin = new Padding(0, 0, 0, 4) });
        root.Controls.Add(new Label { AutoSize = true, Text = selectedApps.Count > 0 ? $"Ready to install {selectedApps.Count} selected apps" : "Choose the apps you want to install.", ForeColor = Color.FromArgb(148, 166, 188), Margin = new Padding(0, 0, 0, 18) });

        appList.Dock = DockStyle.Fill; appList.FlowDirection = FlowDirection.TopDown; appList.WrapContents = false; appList.AutoScroll = true; appList.BackColor = Color.FromArgb(10, 23, 39); appList.Padding = new Padding(12); root.Controls.Add(appList);
        foreach (var app in (selectedApps.Count > 0 ? selectedApps : Catalog.ToList())) AddAppRow(app, selectedApps.Count > 0);

        progress.Dock = DockStyle.Top; progress.Height = 18; progress.Style = ProgressBarStyle.Continuous; progress.Margin = new Padding(0, 18, 0, 10); root.Controls.Add(progress);
        var bottom = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 2, AutoSize = true }; bottom.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100)); bottom.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        status.Text = "Ready"; status.AutoSize = true; status.Anchor = AnchorStyles.Left; status.ForeColor = Color.FromArgb(148, 166, 188);
        installButton.Text = "Install selected apps"; installButton.AutoSize = true; installButton.Padding = new Padding(20, 10, 20, 10); installButton.FlatStyle = FlatStyle.Flat; installButton.FlatAppearance.BorderSize = 0; installButton.BackColor = Color.FromArgb(67, 215, 255); installButton.ForeColor = Color.FromArgb(6, 16, 29); installButton.Font = new Font("Segoe UI", 10f, FontStyle.Bold); installButton.Click += async (_, _) => await InstallAsync();
        bottom.Controls.Add(status, 0, 0); bottom.Controls.Add(installButton, 1, 0); root.Controls.Add(bottom);
    }

    private void AddAppRow(AppItem app, bool lockedSelection)
    {
        var panel = new Panel { Width = 875, Height = 68, Margin = new Padding(0, 0, 0, 8), BackColor = Color.FromArgb(16, 31, 51) };
        var check = new CheckBox { Checked = lockedSelection || selectedApps.Contains(app), Enabled = !lockedSelection, AutoSize = true, Location = new Point(16, 24), Tag = app };
        var picture = new PictureBox { Location = new Point(48, 10), Size = new Size(46, 46), SizeMode = PictureBoxSizeMode.Zoom, BackColor = Color.Transparent };
        var name = new Label { Text = app.Name, AutoSize = true, Location = new Point(108, 11), Font = new Font("Segoe UI", 10f, FontStyle.Bold), ForeColor = Color.White };
        var packageText = app.PackageId.StartsWith("url:", StringComparison.OrdinalIgnoreCase) ? "Official download page" : app.PackageId;
        var id = new Label { Text = packageText, AutoSize = true, Location = new Point(108, 35), Font = new Font("Segoe UI", 8.5f), ForeColor = Color.FromArgb(145, 160, 181) };
        panel.Controls.Add(check); panel.Controls.Add(picture); panel.Controls.Add(name); panel.Controls.Add(id); appList.Controls.Add(panel);
        _ = LoadIconAsync(picture, app.IconUrl);
    }

    private static async Task LoadIconAsync(PictureBox box, string url)
    {
        try
        {
            var bytes = await Http.GetByteArrayAsync(url);
            using var ms = new MemoryStream(bytes);
            using var original = Image.FromStream(ms);
            if (!box.IsDisposed) box.Image = new Bitmap(original);
        }
        catch { }
    }

    private List<AppItem> CurrentSelection()
    {
        var list = new List<AppItem>();
        foreach (Control p in appList.Controls) foreach (Control c in p.Controls) if (c is CheckBox cb && cb.Checked && cb.Tag is AppItem a) list.Add(a);
        return list;
    }

    private async Task InstallAsync()
    {
        var apps = CurrentSelection();
        if (apps.Count == 0) { MessageBox.Show("Select at least one app.", "AppForge", MessageBoxButtons.OK, MessageBoxIcon.Information); return; }
        installButton.Enabled = false; progress.Maximum = apps.Count; progress.Value = 0; int ok = 0;
        foreach (var app in apps)
        {
            status.Text = $"Processing {app.Name}...";
            try
            {
                if (app.PackageId.StartsWith("url:", StringComparison.OrdinalIgnoreCase))
                {
                    Process.Start(new ProcessStartInfo(app.PackageId[4..]) { UseShellExecute = true });
                    ok++;
                }
                else
                {
                    var psi = new ProcessStartInfo("winget", $"install --id \"{app.PackageId}\" -e --silent --accept-package-agreements --accept-source-agreements") { UseShellExecute = false, CreateNoWindow = true, RedirectStandardOutput = true, RedirectStandardError = true };
                    using var p = Process.Start(psi); if (p == null) throw new Exception("Could not start Winget."); await p.WaitForExitAsync(); if (p.ExitCode == 0) ok++;
                }
            }
            catch (Exception ex) { MessageBox.Show($"{app.Name}: {ex.Message}", "Installation error", MessageBoxButtons.OK, MessageBoxIcon.Warning); }
            progress.Value++;
        }
        status.Text = $"Finished — {ok}/{apps.Count} completed."; installButton.Enabled = true; installButton.Text = "Run again";
    }

    private static List<AppItem> ReadSelectionFromFilename()
    {
        var file = Path.GetFileNameWithoutExtension(Application.ExecutablePath);
        var marker = file.IndexOf("--", StringComparison.Ordinal);
        if (marker < 0) return new();
        var ids = file[(marker + 2)..].Split('.', StringSplitOptions.RemoveEmptyEntries).Select(x => int.TryParse(x, out var n) ? n : -1).Where(x => x >= 0).ToHashSet();
        return Catalog.Where(a => ids.Contains(a.Index)).ToList();
    }

    private sealed record AppItem(int Index, string Name, string PackageId, string IconUrl);
}