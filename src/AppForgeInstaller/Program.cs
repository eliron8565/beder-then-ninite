using System.Diagnostics;
using System.Text;

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
    private readonly Label counter = new();
    private readonly Label subtitle = new();
    private readonly Button installButton = new();
    private readonly Button cancelButton = new();
    private readonly Dictionary<int, Label> stateLabels = new();
    private readonly List<AppItem> selectedApps;
    private CancellationTokenSource? cancellation;
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
        selectedApps = ReadSelectionFromExecutable();
        Text = "AppForge Installer";
        StartPosition = FormStartPosition.CenterScreen;
        MinimumSize = new Size(780, 560);
        Size = new Size(940, 690);
        BackColor = Color.FromArgb(7, 15, 27);
        ForeColor = Color.White;
        Font = new Font("Segoe UI", 10f);
        Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath);
        BuildUi();
    }

    private void BuildUi()
    {
        var root = new TableLayoutPanel { Dock = DockStyle.Fill, Padding = new Padding(28), RowCount = 6, ColumnCount = 1, BackColor = BackColor };
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.Percent, 100));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        Controls.Add(root);

        var brandRow = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 2, AutoSize = true };
        brandRow.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        brandRow.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        brandRow.Controls.Add(new Label { AutoSize = true, Text = "AppForge", Font = new Font("Segoe UI", 30, FontStyle.Bold), ForeColor = Color.White }, 0, 0);
        var secure = new Label { AutoSize = true, Text = "● Secure installer", ForeColor = Color.FromArgb(111, 231, 183), Font = new Font("Segoe UI", 9f, FontStyle.Bold), Anchor = AnchorStyles.Right, Padding = new Padding(0, 12, 0, 0) };
        brandRow.Controls.Add(secure, 1, 0);
        root.Controls.Add(brandRow);

        subtitle.AutoSize = true;
        subtitle.Text = selectedApps.Count > 0 ? $"Your {selectedApps.Count} selected apps are ready. AppForge will install them automatically." : "This installer does not contain a website selection.";
        subtitle.ForeColor = Color.FromArgb(155, 170, 191);
        subtitle.Margin = new Padding(0, 2, 0, 16);
        root.Controls.Add(subtitle);

        var tip = new Label { AutoSize = true, Text = "No re-selecting. No commands. No bundled adware. AppForge uses Winget and official download pages.", ForeColor = Color.FromArgb(103, 210, 255), Font = new Font("Segoe UI", 9f), Margin = new Padding(0, 0, 0, 16) };
        root.Controls.Add(tip);

        appList.Dock = DockStyle.Fill;
        appList.FlowDirection = FlowDirection.TopDown;
        appList.WrapContents = false;
        appList.AutoScroll = true;
        appList.BackColor = Color.FromArgb(10, 22, 37);
        appList.Padding = new Padding(12);
        root.Controls.Add(appList);

        if (selectedApps.Count > 0)
        {
            foreach (var app in selectedApps) AddAppRow(app);
        }
        else
        {
            appList.Controls.Add(new Label { AutoSize = false, Width = 820, Height = 110, Text = "Go back to the AppForge website, choose your apps, and download a fresh installer.", TextAlign = ContentAlignment.MiddleCenter, ForeColor = Color.FromArgb(155, 170, 191), Font = new Font("Segoe UI", 11f) });
        }

        var progressRow = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 2, AutoSize = true, Margin = new Padding(0, 16, 0, 8) };
        progressRow.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        progressRow.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        progress.Dock = DockStyle.Fill;
        progress.Height = 16;
        progress.Style = ProgressBarStyle.Continuous;
        counter.AutoSize = true;
        counter.Text = selectedApps.Count > 0 ? $"0 / {selectedApps.Count}" : "0 / 0";
        counter.ForeColor = Color.FromArgb(155, 170, 191);
        counter.Margin = new Padding(14, 0, 0, 0);
        progressRow.Controls.Add(progress, 0, 0);
        progressRow.Controls.Add(counter, 1, 0);
        root.Controls.Add(progressRow);

        var bottom = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 3, AutoSize = true };
        bottom.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        bottom.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        bottom.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        status.Text = selectedApps.Count > 0 ? "Ready to install" : "Selection missing";
        status.AutoSize = true;
        status.Anchor = AnchorStyles.Left;
        status.ForeColor = Color.FromArgb(155, 170, 191);

        cancelButton.Text = "Cancel";
        cancelButton.AutoSize = true;
        cancelButton.Enabled = false;
        cancelButton.Margin = new Padding(10, 0, 10, 0);
        cancelButton.Padding = new Padding(16, 9, 16, 9);
        cancelButton.FlatStyle = FlatStyle.Flat;
        cancelButton.FlatAppearance.BorderColor = Color.FromArgb(53, 70, 92);
        cancelButton.BackColor = Color.FromArgb(14, 27, 45);
        cancelButton.ForeColor = Color.White;
        cancelButton.Click += (_, _) => cancellation?.Cancel();

        installButton.Text = "Install my apps";
        installButton.AutoSize = true;
        installButton.Padding = new Padding(22, 10, 22, 10);
        installButton.FlatStyle = FlatStyle.Flat;
        installButton.FlatAppearance.BorderSize = 0;
        installButton.BackColor = Color.FromArgb(82, 219, 255);
        installButton.ForeColor = Color.FromArgb(5, 17, 29);
        installButton.Font = new Font("Segoe UI", 10f, FontStyle.Bold);
        installButton.Enabled = selectedApps.Count > 0;
        installButton.Click += async (_, _) => await InstallAsync();

        bottom.Controls.Add(status, 0, 0);
        bottom.Controls.Add(cancelButton, 1, 0);
        bottom.Controls.Add(installButton, 2, 0);
        root.Controls.Add(bottom);
    }

    private void AddAppRow(AppItem app)
    {
        var panel = new Panel { Width = 830, Height = 64, Margin = new Padding(0, 0, 0, 7), BackColor = Color.FromArgb(16, 31, 50) };
        var picture = new PictureBox { Location = new Point(16, 10), Size = new Size(42, 42), SizeMode = PictureBoxSizeMode.Zoom, BackColor = Color.Transparent };
        var name = new Label { Text = app.Name, AutoSize = true, Location = new Point(74, 10), Font = new Font("Segoe UI", 10f, FontStyle.Bold), ForeColor = Color.White };
        var detail = new Label { Text = app.PackageId.StartsWith("url:") ? "Official download page" : "Automatic install via Winget", AutoSize = true, Location = new Point(74, 34), Font = new Font("Segoe UI", 8.5f), ForeColor = Color.FromArgb(140, 157, 179) };
        var state = new Label { Text = "Ready", AutoSize = false, Width = 128, Height = 24, Location = new Point(680, 20), TextAlign = ContentAlignment.MiddleRight, Font = new Font("Segoe UI", 9f, FontStyle.Bold), ForeColor = Color.FromArgb(111, 231, 183) };
        stateLabels[app.Index] = state;
        panel.Controls.Add(picture); panel.Controls.Add(name); panel.Controls.Add(detail); panel.Controls.Add(state);
        appList.Controls.Add(panel);
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

    private async Task InstallAsync()
    {
        if (selectedApps.Count == 0) return;
        cancellation = new CancellationTokenSource();
        var token = cancellation.Token;
        installButton.Enabled = false;
        cancelButton.Enabled = true;
        progress.Maximum = selectedApps.Count;
        progress.Value = 0;
        var ok = 0;
        var failed = 0;
        var opened = 0;
        var sw = Stopwatch.StartNew();

        foreach (var app in selectedApps)
        {
            if (token.IsCancellationRequested) break;
            SetState(app, "Installing…", Color.FromArgb(103, 210, 255));
            status.Text = $"Installing {app.Name}…";
            try
            {
                if (app.PackageId.StartsWith("url:", StringComparison.OrdinalIgnoreCase))
                {
                    Process.Start(new ProcessStartInfo(app.PackageId[4..]) { UseShellExecute = true });
                    opened++;
                    SetState(app, "Opened official page", Color.FromArgb(244, 196, 95));
                }
                else
                {
                    var result = await RunWingetAsync(app.PackageId, token);
                    if (result == 0)
                    {
                        ok++;
                        SetState(app, "Installed ✓", Color.FromArgb(111, 231, 183));
                    }
                    else
                    {
                        failed++;
                        SetState(app, "Needs attention", Color.FromArgb(255, 139, 139));
                    }
                }
            }
            catch (OperationCanceledException)
            {
                SetState(app, "Cancelled", Color.FromArgb(155, 170, 191));
                break;
            }
            catch
            {
                failed++;
                SetState(app, "Failed", Color.FromArgb(255, 139, 139));
            }
            progress.Value = Math.Min(progress.Maximum, progress.Value + 1);
            counter.Text = $"{progress.Value} / {selectedApps.Count}";
        }

        sw.Stop();
        cancelButton.Enabled = false;
        installButton.Enabled = true;
        installButton.Text = failed > 0 ? "Retry" : "Run again";
        if (token.IsCancellationRequested)
            status.Text = $"Cancelled — {ok} installed.";
        else if (failed == 0)
            status.Text = $"Done — {ok} installed{(opened > 0 ? $", {opened} official pages opened" : "")} in {Math.Max(1, (int)sw.Elapsed.TotalMinutes)} min.";
        else
            status.Text = $"Finished — {ok} installed, {failed} need attention.";
    }

    private static async Task<int> RunWingetAsync(string packageId, CancellationToken token)
    {
        var psi = new ProcessStartInfo("winget", $"install --id \"{packageId}\" -e --silent --disable-interactivity --accept-package-agreements --accept-source-agreements")
        {
            UseShellExecute = false,
            CreateNoWindow = true,
            RedirectStandardOutput = true,
            RedirectStandardError = true
        };
        using var process = Process.Start(psi) ?? throw new InvalidOperationException("Winget could not start.");
        await process.WaitForExitAsync(token);
        return process.ExitCode;
    }

    private void SetState(AppItem app, string text, Color color)
    {
        if (!stateLabels.TryGetValue(app.Index, out var label)) return;
        label.Text = text;
        label.ForeColor = color;
    }

    private static List<AppItem> ReadSelectionFromExecutable()
    {
        try
        {
            var fileName = Path.GetFileNameWithoutExtension(Application.ExecutablePath);
            const string prefix = "AppForge-";
            if (fileName.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
            {
                var token = fileName[prefix.Length..].Replace('-', '+').Replace('_', '/');
                token += token.Length % 4 switch { 2 => "==", 3 => "=", _ => "" };
                var bits = Convert.FromBase64String(token);
                var ids = new HashSet<int>();
                for (var index = 0; index < bits.Length * 8; index++)
                    if ((bits[index / 8] & (1 << (index % 8))) != 0) ids.Add(index);
                var fromName = Catalog.Where(a => ids.Contains(a.Index)).ToList();
                if (fromName.Count > 0) return fromName;
            }
        }
        catch { }

        try
        {
            var bytes = File.ReadAllBytes(Application.ExecutablePath);
            var marker = Encoding.UTF8.GetBytes("\nAPPFORGE_SELECTION_V1:");
            var endMarker = Encoding.UTF8.GetBytes(":END\n");
            var start = LastIndexOf(bytes, marker);
            if (start < 0) return new();
            start += marker.Length;
            var end = IndexOf(bytes, endMarker, start);
            if (end < 0 || end <= start) return new();
            var code = Encoding.UTF8.GetString(bytes, start, end - start);
            var ids = code.Split('.', StringSplitOptions.RemoveEmptyEntries).Select(x => int.TryParse(x, out var n) ? n : -1).Where(x => x >= 0).ToHashSet();
            return Catalog.Where(a => ids.Contains(a.Index)).ToList();
        }
        catch { return new(); }
    }

    private static int IndexOf(byte[] data, byte[] pattern, int start)
    {
        for (var i = start; i <= data.Length - pattern.Length; i++)
        {
            var match = true;
            for (var j = 0; j < pattern.Length; j++) if (data[i + j] != pattern[j]) { match = false; break; }
            if (match) return i;
        }
        return -1;
    }

    private static int LastIndexOf(byte[] data, byte[] pattern)
    {
        for (var i = data.Length - pattern.Length; i >= 0; i--)
        {
            var match = true;
            for (var j = 0; j < pattern.Length; j++) if (data[i + j] != pattern[j]) { match = false; break; }
            if (match) return i;
        }
        return -1;
    }
}

internal sealed record AppItem(int Index, string Name, string PackageId, string IconUrl);