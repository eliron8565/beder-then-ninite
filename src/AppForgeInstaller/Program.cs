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
        new(0,"Google Chrome","Google.Chrome",Fav("google.com/chrome")), new(1,"Mozilla Firefox","Mozilla.Firefox",Fav("mozilla.org/firefox")), new(2,"Brave","Brave.Brave",Fav("brave.com")),
        new(3,"Discord","Discord.Discord",Fav("discord.com")), new(4,"Telegram","Telegram.TelegramDesktop",Fav("telegram.org")), new(5,"Slack","SlackTechnologies.Slack",Fav("slack.com")),
        new(6,"Steam","Valve.Steam",Fav("steampowered.com")), new(7,"Prism Launcher","PrismLauncher.PrismLauncher",Fav("prismlauncher.org")), new(8,"Heroic Games Launcher","HeroicGamesLauncher.HeroicGamesLauncher",Fav("heroicgameslauncher.com")),
        new(9,"7-Zip","7zip.7zip",Fav("7-zip.org")), new(10,"VLC","VideoLAN.VLC",Fav("videolan.org")), new(11,"Spotify","Spotify.Spotify",Fav("spotify.com")),
        new(12,"OBS Studio","OBSProject.OBSStudio",Fav("obsproject.com")), new(13,"Audacity","Audacity.Audacity",Fav("audacityteam.org")), new(14,"Krita","KDE.Krita",Fav("krita.org")),
        new(15,"GIMP","GIMP.GIMP.3",Fav("gimp.org")), new(16,"Blender","BlenderFoundation.Blender",Fav("blender.org")), new(17,"Visual Studio Code","Microsoft.VisualStudioCode",Fav("code.visualstudio.com")),
        new(18,"Git","Git.Git",Fav("git-scm.com")), new(19,"Python 3","Python.Python.3.13",Fav("python.org")), new(20,"Node.js LTS","OpenJS.NodeJS.LTS",Fav("nodejs.org")),
        new(21,"Docker Desktop","Docker.DockerDesktop",Fav("docker.com")), new(22,"Postman","Postman.Postman",Fav("postman.com")), new(23,"LibreOffice","TheDocumentFoundation.LibreOffice",Fav("libreoffice.org")),
        new(24,"Obsidian","Obsidian.Obsidian",Fav("obsidian.md")), new(25,"Thunderbird","Mozilla.Thunderbird",Fav("thunderbird.net")), new(26,"qBittorrent","qBittorrent.qBittorrent",Fav("qbittorrent.org")),
        new(27,"Tailscale","Tailscale.Tailscale",Fav("tailscale.com")), new(28,"Bitwarden","Bitwarden.Bitwarden",Fav("bitwarden.com")), new(29,"KeePassXC","KeePassXCTeam.KeePassXC",Fav("keepassxc.org")),
        new(30,"RustDesk","RustDesk.RustDesk",Fav("rustdesk.com")), new(31,"Cisco Packet Tracer","url:https://www.netacad.com/learning-collections/cisco-packet-tracer",Fav("cisco.com")),
        new(32,"PyCharm Community","JetBrains.PyCharm.Community",Fav("jetbrains.com/pycharm")), new(33,"IntelliJ IDEA Community","JetBrains.IntelliJIDEA.Community",Fav("jetbrains.com/idea")),
        new(34,"Blockbench","JannisX11.Blockbench",Fav("blockbench.net")), new(35,"balenaEtcher","Balena.Etcher",Fav("etcher.balena.io")), new(36,"Rufus","Rufus.Rufus",Fav("rufus.ie")),
        new(37,"PeaZip","Giorgiotani.Peazip",Fav("peazip.github.io")), new(38,"WizTree","AntibodySoftware.WizTree",Fav("diskanalyzer.com")), new(39,"WinRAR","RARLab.WinRAR",Fav("rarlab.com")),
        new(40,"MiniTool Partition Wizard","MiniTool.PartitionWizard.Free",Fav("partitionwizard.com")),
        new(41,"Microsoft Edge","Microsoft.Edge",Fav("microsoft.com/edge")), new(42,"Opera","Opera.Opera",Fav("opera.com")), new(43,"Vivaldi","Vivaldi.Vivaldi",Fav("vivaldi.com")),
        new(44,"Zoom","Zoom.Zoom",Fav("zoom.us")), new(45,"Microsoft Teams","Microsoft.Teams",Fav("teams.microsoft.com")), new(46,"FileZilla","TimKosse.FileZilla.Client",Fav("filezilla-project.org")),
        new(47,"Notepad++","Notepad++.Notepad++",Fav("notepad-plus-plus.org")), new(48,"WinSCP","WinSCP.WinSCP",Fav("winscp.net")), new(49,"PuTTY","PuTTY.PuTTY",Fav("putty.org")),
        new(50,"AnyDesk","AnyDeskSoftwareGmbH.AnyDesk",Fav("anydesk.com")), new(51,"TeamViewer","TeamViewer.TeamViewer",Fav("teamviewer.com")), new(52,"Everything","voidtools.Everything",Fav("voidtools.com")),
        new(53,"ShareX","ShareX.ShareX",Fav("getsharex.com")), new(54,"HandBrake","HandBrake.HandBrake",Fav("handbrake.fr")), new(55,"GitHub Desktop","GitHub.GitHubDesktop",Fav("desktop.github.com")),
        new(56,"Inkscape","Inkscape.Inkscape",Fav("inkscape.org")), new(57,"Malwarebytes","Malwarebytes.Malwarebytes",Fav("malwarebytes.com")), new(58,"HWiNFO","REALiX.HWiNFO",Fav("hwinfo.com")),
        new(59,"CPU-Z","CPUID.CPU-Z",Fav("cpuid.com")), new(60,"CrystalDiskInfo","CrystalDewWorld.CrystalDiskInfo",Fav("crystalmark.info")), new(61,"PowerToys","Microsoft.PowerToys",Fav("learn.microsoft.com/windows/powertoys")),
        new(62,"NVIDIA Graphics Drivers","url:https://www.nvidia.com/Download/index.aspx",Fav("nvidia.com")), new(63,"NVIDIA App","url:https://www.nvidia.com/en-us/software/nvidia-app/",Fav("nvidia.com")),
        new(64,"AMD Radeon Drivers","url:https://www.amd.com/en/support/download/drivers.html",Fav("amd.com")), new(65,"AMD Software: Adrenalin Edition","url:https://www.amd.com/en/products/software/adrenalin.html",Fav("amd.com"))
    };

    public MainForm()
    {
        selectedApps = ReadSelectionFromFilename();
        Text = "AppForge Installer";
        StartPosition = FormStartPosition.CenterScreen;
        MinimumSize = new Size(760, 560);
        Size = new Size(920, 680);
        BackColor = Color.FromArgb(7,17,31);
        ForeColor = Color.White;
        Font = new Font("Segoe UI", 10f);
        Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath);
        BuildUi();
    }

    private void BuildUi()
    {
        var root = new TableLayoutPanel { Dock = DockStyle.Fill, Padding = new Padding(28), RowCount = 5, ColumnCount = 1, BackColor = BackColor };
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize)); root.RowStyles.Add(new RowStyle(SizeType.AutoSize)); root.RowStyles.Add(new RowStyle(SizeType.Percent, 100)); root.RowStyles.Add(new RowStyle(SizeType.AutoSize)); root.RowStyles.Add(new RowStyle(SizeType.AutoSize)); Controls.Add(root);
        root.Controls.Add(new Label { AutoSize = true, Text = "AppForge", Font = new Font("Segoe UI", 28, FontStyle.Bold), ForeColor = Color.White, Margin = new Padding(0,0,0,4) });
        root.Controls.Add(new Label { AutoSize = true, Text = selectedApps.Count > 0 ? $"Ready to install {selectedApps.Count} selected apps" : "Choose the apps you want to install.", ForeColor = Color.FromArgb(150,165,187), Margin = new Padding(0,0,0,18) });
        appList.Dock = DockStyle.Fill; appList.FlowDirection = FlowDirection.TopDown; appList.WrapContents = false; appList.AutoScroll = true; appList.BackColor = Color.FromArgb(11,21,37); appList.Padding = new Padding(12); root.Controls.Add(appList);
        foreach (var app in (selectedApps.Count > 0 ? selectedApps : Catalog.ToList())) AddAppRow(app, selectedApps.Count > 0);
        progress.Dock = DockStyle.Top; progress.Height = 16; progress.Style = ProgressBarStyle.Continuous; progress.Margin = new Padding(0,18,0,10); root.Controls.Add(progress);
        var bottom = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 2, AutoSize = true }; bottom.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100)); bottom.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        status.Text = "Ready"; status.AutoSize = true; status.Anchor = AnchorStyles.Left; status.ForeColor = Color.FromArgb(150,165,187);
        installButton.Text = "Install selected apps"; installButton.AutoSize = true; installButton.Padding = new Padding(18,10,18,10); installButton.FlatStyle = FlatStyle.Flat; installButton.FlatAppearance.BorderSize = 0; installButton.BackColor = Color.FromArgb(104,224,255); installButton.ForeColor = Color.FromArgb(6,17,31); installButton.Font = new Font("Segoe UI", 10f, FontStyle.Bold); installButton.Click += async (_,__) => await InstallAsync();
        bottom.Controls.Add(status,0,0); bottom.Controls.Add(installButton,1,0); root.Controls.Add(bottom);
    }

    private void AddAppRow(AppItem app, bool lockedSelection)
    {
        var panel = new Panel { Width = 820, Height = 66, Margin = new Padding(0,0,0,8), BackColor = Color.FromArgb(17,31,52) };
        var check = new CheckBox { Checked = lockedSelection || selectedApps.Contains(app), Enabled = !lockedSelection, AutoSize = true, Location = new Point(16,23), Tag = app };
        var picture = new PictureBox { Location = new Point(48,9), Size = new Size(46,46), SizeMode = PictureBoxSizeMode.Zoom, BackColor = Color.Transparent };
        var name = new Label { Text = app.Name, AutoSize = true, Location = new Point(108,10), Font = new Font("Segoe UI",10f,FontStyle.Bold), ForeColor = Color.White };
        var packageText = app.PackageId.StartsWith("url:", StringComparison.OrdinalIgnoreCase) ? "Official download page" : app.PackageId;
        var id = new Label { Text = packageText, AutoSize = true, Location = new Point(108,34), Font = new Font("Segoe UI",8.5f), ForeColor = Color.FromArgb(145,160,181) };
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
            box.Image = new Bitmap(original);
        }
        catch { }
    }

    private List<AppItem> CurrentSelection()
    {
        var list = new List<AppItem>(); foreach (Control p in appList.Controls) foreach (Control c in p.Controls) if (c is CheckBox cb && cb.Checked && cb.Tag is AppItem a) list.Add(a); return list;
    }

    private async Task InstallAsync()
    {
        var apps = CurrentSelection(); if (apps.Count == 0) { MessageBox.Show("Select at least one app.", "AppForge", MessageBoxButtons.OK, MessageBoxIcon.Information); return; }
        installButton.Enabled = false; progress.Maximum = apps.Count; progress.Value = 0; int ok = 0;
        foreach (var app in apps)
        {
            status.Text = $"Installing {app.Name}...";
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
        var file = Path.GetFileNameWithoutExtension(Application.ExecutablePath); var marker = file.IndexOf("--", StringComparison.Ordinal); if (marker < 0) return new(); var code = file[(marker + 2)..];
        var ids = code.Split('.', StringSplitOptions.RemoveEmptyEntries).Select(x => int.TryParse(x, out var n) ? n : -1).Where(x => x >= 0).ToHashSet(); return Catalog.Where(a => ids.Contains(a.Index)).ToList();
    }

    private sealed record AppItem(int Index, string Name, string PackageId, string IconUrl);
}