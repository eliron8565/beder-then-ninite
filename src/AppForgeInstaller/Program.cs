using System.Diagnostics;
using System.Text;
using System.Text.RegularExpressions;

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
    private readonly ProgressBar overallProgress = new();
    private readonly Label status = new();
    private readonly Label counter = new();
    private readonly Label subtitle = new();
    private readonly Button installButton = new();
    private readonly Button cancelButton = new();
    private readonly Dictionary<int, Label> stateLabels = new();
    private readonly Dictionary<int, ProgressBar> appProgressBars = new();
    private readonly Dictionary<int, Label> percentLabels = new();
    private readonly List<AppItem> selectedApps;
    private CancellationTokenSource? cancellation;
    private Process? activeProcess;

    private static readonly HttpClient Http = new() { Timeout = TimeSpan.FromSeconds(8) };
    private static readonly Regex PercentRegex = new(@"(?<!\d)(100|[1-9]?\d)\s*%", RegexOptions.Compiled);
    private static readonly Regex SizeRegex = new(@"(?<done>[\d.,]+)\s*(?<doneUnit>KB|MB|GB)\s*/\s*(?<total>[\d.,]+)\s*(?<totalUnit>KB|MB|GB)", RegexOptions.Compiled | RegexOptions.IgnoreCase);
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
        MinimumSize = new Size(820, 600);
        Size = new Size(980, 730);
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
        brandRow.Controls.Add(new Label { AutoSize = true, Text = "● Free • Open Source • No ads", ForeColor = Color.FromArgb(111, 231, 183), Font = new Font("Segoe UI", 9f, FontStyle.Bold), Anchor = AnchorStyles.Right, Padding = new Padding(0, 12, 0, 0) }, 1, 0);
        root.Controls.Add(brandRow);

        subtitle.AutoSize = true;
        subtitle.Text = selectedApps.Count > 0 ? $"Your {selectedApps.Count} selected apps are ready. AppForge will install them automatically." : "This installer does not contain a website selection.";
        subtitle.ForeColor = Color.FromArgb(155, 170, 191);
        subtitle.Margin = new Padding(0, 2, 0, 10);
        root.Controls.Add(subtitle);

        root.Controls.Add(new Label { AutoSize = true, Text = "No re-selecting. No commands. No bundled offers. Download progress is shown when Winget reports it.", ForeColor = Color.FromArgb(103, 210, 255), Font = new Font("Segoe UI", 9f), Margin = new Padding(0, 0, 0, 16) });

        appList.Dock = DockStyle.Fill;
        appList.FlowDirection = FlowDirection.TopDown;
        appList.WrapContents = false;
        appList.AutoScroll = true;
        appList.BackColor = Color.FromArgb(10, 22, 37);
        appList.Padding = new Padding(12);
        root.Controls.Add(appList);

        if (selectedApps.Count > 0)
            foreach (var app in selectedApps) AddAppRow(app);
        else
            appList.Controls.Add(new Label { AutoSize = false, Width = 850, Height = 110, Text = "Go back to the AppForge website, choose your apps, and download a fresh installer.", TextAlign = ContentAlignment.MiddleCenter, ForeColor = Color.FromArgb(155, 170, 191), Font = new Font("Segoe UI", 11f) });

        var progressRow = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 2, AutoSize = true, Margin = new Padding(0, 16, 0, 8) };
        progressRow.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        progressRow.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        overallProgress.Dock = DockStyle.Fill;
        overallProgress.Height = 16;
        overallProgress.Style = ProgressBarStyle.Continuous;
        counter.AutoSize = true;
        counter.Text = selectedApps.Count > 0 ? $"0 / {selectedApps.Count}" : "0 / 0";
        counter.ForeColor = Color.FromArgb(155, 170, 191);
        counter.Margin = new Padding(14, 0, 0, 0);
        progressRow.Controls.Add(overallProgress, 0, 0);
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
        cancelButton.Click += (_, _) => { cancellation?.Cancel(); try { activeProcess?.Kill(true); } catch { } };

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
        var panel = new Panel { Width = 865, Height = 76, Margin = new Padding(0, 0, 0, 8), BackColor = Color.FromArgb(16, 31, 50) };
        var picture = new PictureBox { Location = new Point(16, 11), Size = new Size(42, 42), SizeMode = PictureBoxSizeMode.Zoom, BackColor = Color.Transparent };
        var name = new Label { Text = app.Name, AutoSize = true, Location = new Point(74, 9), Font = new Font("Segoe UI", 10f, FontStyle.Bold), ForeColor = Color.White };
        var detail = new Label { Text = app.PackageId.StartsWith("url:") ? "Official download page" : "Automatic install via Winget", AutoSize = true, Location = new Point(74, 31), Font = new Font("Segoe UI", 8.5f), ForeColor = Color.FromArgb(140, 157, 179) };
        var appProgress = new ProgressBar { Location = new Point(74, 54), Size = new Size(570, 10), Minimum = 0, Maximum = 100, Value = 0, Style = ProgressBarStyle.Continuous };
        var percent = new Label { Text = "0%", AutoSize = false, Width = 55, Height = 20, Location = new Point(652, 49), TextAlign = ContentAlignment.MiddleRight, Font = new Font("Segoe UI", 8.5f), ForeColor = Color.FromArgb(155, 170, 191) };
        var state = new Label { Text = "Ready", AutoSize = false, Width = 135, Height = 24, Location = new Point(708, 24), TextAlign = ContentAlignment.MiddleRight, Font = new Font("Segoe UI", 9f, FontStyle.Bold), ForeColor = Color.FromArgb(111, 231, 183) };
        stateLabels[app.Index] = state;
        appProgressBars[app.Index] = appProgress;
        percentLabels[app.Index] = percent;
        panel.Controls.Add(picture); panel.Controls.Add(name); panel.Controls.Add(detail); panel.Controls.Add(appProgress); panel.Controls.Add(percent); panel.Controls.Add(state);
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
        overallProgress.Maximum = selectedApps.Count;
        overallProgress.Value = 0;
        var ok = 0;
        var failed = 0;
        var opened = 0;
        var sw = Stopwatch.StartNew();

        foreach (var app in selectedApps)
        {
            if (token.IsCancellationRequested) break;
            UpdateAppProgress(app, 0, "Starting…");
            try
            {
                if (app.PackageId.StartsWith("url:", StringComparison.OrdinalIgnoreCase))
                {
                    Process.Start(new ProcessStartInfo(app.PackageId[4..]) { UseShellExecute = true });
                    opened++;
                    UpdateAppProgress(app, 100, "Official page opened", Color.FromArgb(244, 196, 95));
                }
                else
                {
                    var exitCode = await RunWingetAsync(app, token);
                    if (token.IsCancellationRequested) break;
                    if (exitCode == 0)
                    {
                        ok++;
                        UpdateAppProgress(app, 100, "Installed ✓", Color.FromArgb(111, 231, 183));
                    }
                    else
                    {
                        failed++;
                        UpdateAppProgress(app, appProgressBars[app.Index].Value, "Failed", Color.FromArgb(255, 120, 130));
                    }
                }
            }
            catch (OperationCanceledException) { break; }
            catch
            {
                failed++;
                UpdateAppProgress(app, appProgressBars[app.Index].Value, "Failed", Color.FromArgb(255, 120, 130));
            }

            overallProgress.Value = Math.Min(overallProgress.Maximum, overallProgress.Value + 1);
            counter.Text = $"{overallProgress.Value} / {selectedApps.Count}";
        }

        sw.Stop();
        cancelButton.Enabled = false;
        installButton.Enabled = true;
        activeProcess = null;

        if (token.IsCancellationRequested)
        {
            status.Text = "Cancelled";
            installButton.Text = "Continue";
            return;
        }

        status.Text = failed == 0
            ? $"Done — {ok} installed{(opened > 0 ? $", {opened} official page(s) opened" : "")} in {Math.Max(1, (int)sw.Elapsed.TotalSeconds)}s."
            : $"Finished — {ok} installed, {failed} failed, {opened} page(s) opened.";
        installButton.Text = failed > 0 ? "Retry failed apps" : "Run again";
    }

    private async Task<int> RunWingetAsync(AppItem app, CancellationToken token)
    {
        status.Text = $"Downloading {app.Name}…";
        var psi = new ProcessStartInfo("winget", $"install --id \"{app.PackageId}\" -e --silent --accept-package-agreements --accept-source-agreements --disable-interactivity")
        {
            UseShellExecute = false,
            CreateNoWindow = true,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            StandardOutputEncoding = Encoding.UTF8,
            StandardErrorEncoding = Encoding.UTF8
        };

        using var p = new Process { StartInfo = psi, EnableRaisingEvents = true };
        activeProcess = p;
        p.Start();

        var outputTask = ReadProgressAsync(p.StandardOutput, app, token);
        var errorTask = ReadProgressAsync(p.StandardError, app, token);
        await p.WaitForExitAsync(token);
        await Task.WhenAll(outputTask, errorTask);
        return p.ExitCode;
    }

    private async Task ReadProgressAsync(StreamReader reader, AppItem app, CancellationToken token)
    {
        while (!reader.EndOfStream && !token.IsCancellationRequested)
        {
            var line = await reader.ReadLineAsync(token);
            if (string.IsNullOrWhiteSpace(line)) continue;
            var pct = ExtractPercent(line);
            if (pct.HasValue)
                BeginInvoke(() => UpdateAppProgress(app, pct.Value, $"Downloading {pct.Value}%"));
            else if (line.Contains("Installing", StringComparison.OrdinalIgnoreCase))
                BeginInvoke(() => UpdateAppProgress(app, appProgressBars[app.Index].Value, "Installing…"));
        }
    }

    private static int? ExtractPercent(string text)
    {
        var m = PercentRegex.Match(text);
        if (m.Success && int.TryParse(m.Groups[1].Value, out var direct)) return Math.Clamp(direct, 0, 100);

        var s = SizeRegex.Match(text);
        if (!s.Success) return null;
        if (!double.TryParse(s.Groups["done"].Value.Replace(',', '.'), System.Globalization.NumberStyles.Float, System.Globalization.CultureInfo.InvariantCulture, out var done)) return null;
        if (!double.TryParse(s.Groups["total"].Value.Replace(',', '.'), System.Globalization.NumberStyles.Float, System.Globalization.CultureInfo.InvariantCulture, out var total)) return null;
        done *= UnitMultiplier(s.Groups["doneUnit"].Value);
        total *= UnitMultiplier(s.Groups["totalUnit"].Value);
        if (total <= 0) return null;
        return Math.Clamp((int)Math.Round(done / total * 100), 0, 100);
    }

    private static double UnitMultiplier(string unit) => unit.ToUpperInvariant() switch
    {
        "GB" => 1024d * 1024d,
        "MB" => 1024d,
        _ => 1d
    };

    private void UpdateAppProgress(AppItem app, int percent, string text, Color? color = null)
    {
        if (appProgressBars.TryGetValue(app.Index, out var bar)) bar.Value = Math.Clamp(percent, 0, 100);
        if (percentLabels.TryGetValue(app.Index, out var pct)) pct.Text = $"{Math.Clamp(percent, 0, 100)}%";
        if (stateLabels.TryGetValue(app.Index, out var state))
        {
            state.Text = text;
            if (color.HasValue) state.ForeColor = color.Value;
            else state.ForeColor = Color.FromArgb(103, 210, 255);
        }
        status.Text = $"{app.Name}: {text}";
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
                token += (token.Length % 4) switch { 2 => "==", 3 => "=", _ => "" };
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
            var ids = code.Split('.', StringSplitOptions.RemoveEmptyEntries)
                .Select(x => int.TryParse(x, out var n) ? n : -1)
                .Where(x => x >= 0)
                .ToHashSet();
            return Catalog.Where(a => ids.Contains(a.Index)).ToList();
        }
        catch { return new(); }
    }

    private static int LastIndexOf(byte[] source, byte[] pattern)
    {
        for (var i = source.Length - pattern.Length; i >= 0; i--)
        {
            var ok = true;
            for (var j = 0; j < pattern.Length; j++) if (source[i + j] != pattern[j]) { ok = false; break; }
            if (ok) return i;
        }
        return -1;
    }

    private static int IndexOf(byte[] source, byte[] pattern, int start)
    {
        for (var i = start; i <= source.Length - pattern.Length; i++)
        {
            var ok = true;
            for (var j = 0; j < pattern.Length; j++) if (source[i + j] != pattern[j]) { ok = false; break; }
            if (ok) return i;
        }
        return -1;
    }
}

internal sealed record AppItem(int Index, string Name, string PackageId, string IconUrl);
