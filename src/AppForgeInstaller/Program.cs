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

internal enum AppHealth { Unknown, Missing, Current, Update, Manual, Failed }
internal sealed record AppItem(int Index, string Name, string PackageId, string IconUrl);

internal sealed class MainForm : Form
{
    static readonly Color Bg = Color.FromArgb(6, 14, 26);
    static readonly Color Surface = Color.FromArgb(10, 22, 38);
    static readonly Color Surface2 = Color.FromArgb(15, 31, 51);
    static readonly Color Border = Color.FromArgb(39, 67, 96);
    static readonly Color Text = Color.FromArgb(241, 247, 253);
    static readonly Color Muted = Color.FromArgb(143, 163, 186);
    static readonly Color Cyan = Color.FromArgb(91, 218, 255);
    static readonly Color Green = Color.FromArgb(111, 231, 183);
    static readonly Color Yellow = Color.FromArgb(244, 196, 95);
    static readonly Color Red = Color.FromArgb(255, 120, 130);

    readonly FlowLayoutPanel appList = new();
    readonly ProgressBar overall = new();
    readonly Label status = new(), summary = new(), counter = new();
    readonly Label selectedCard = new(), goodCard = new(), actionCard = new();
    readonly Button fix = new(), scan = new(), retry = new(), copyErrors = new(), cancel = new();
    readonly Dictionary<int, Label> states = new();
    readonly Dictionary<int, ProgressBar> bars = new();
    readonly Dictionary<int, Label> percents = new();
    readonly Dictionary<int, AppHealth> health = new();
    readonly Dictionary<int, string> errors = new();
    readonly List<AppItem> selected;
    CancellationTokenSource? cts;
    Process? active;

    static readonly HttpClient Http = new() { Timeout = TimeSpan.FromSeconds(8) };
    static readonly Regex PercentRegex = new(@"(?<!\d)(100|[1-9]?\d)\s*%", RegexOptions.Compiled);
    static readonly Regex SizeRegex = new(@"(?<done>[\d.,]+)\s*(?<du>KB|MB|GB)\s*/\s*(?<total>[\d.,]+)\s*(?<tu>KB|MB|GB)", RegexOptions.Compiled | RegexOptions.IgnoreCase);
    static string Fav(string d) => $"https://www.google.com/s2/favicons?domain={d}&sz=128";
    static AppItem A(int i, string n, string p, string d) => new(i, n, p, Fav(d));

    static readonly AppItem[] Catalog = {
        A(0,"Google Chrome","Google.Chrome","google.com"),A(1,"Mozilla Firefox","Mozilla.Firefox","mozilla.org"),A(2,"Microsoft Edge","Microsoft.Edge","microsoft.com"),A(3,"Brave","Brave.Brave","brave.com"),A(4,"Opera","Opera.Opera","opera.com"),A(5,"Vivaldi","Vivaldi.Vivaldi","vivaldi.com"),
        A(6,"Discord","Discord.Discord","discord.com"),A(7,"Telegram","Telegram.TelegramDesktop","telegram.org"),A(8,"Slack","SlackTechnologies.Slack","slack.com"),A(9,"Zoom","Zoom.Zoom","zoom.us"),A(10,"Microsoft Teams","Microsoft.Teams","microsoft.com"),A(11,"Steam","Valve.Steam","steampowered.com"),A(12,"Epic Games Launcher","EpicGames.EpicGamesLauncher","epicgames.com"),A(13,"Prism Launcher","PrismLauncher.PrismLauncher","prismlauncher.org"),A(14,"Heroic Games Launcher","HeroicGamesLauncher.HeroicGamesLauncher","heroicgameslauncher.com"),
        A(15,"VLC media player","VideoLAN.VLC","videolan.org"),A(16,"Spotify","Spotify.Spotify","spotify.com"),A(17,"OBS Studio","OBSProject.OBSStudio","obsproject.com"),A(18,"Audacity","Audacity.Audacity","audacityteam.org"),A(19,"HandBrake","HandBrake.HandBrake","handbrake.fr"),A(20,"Visual Studio Code","Microsoft.VisualStudioCode","code.visualstudio.com"),A(21,"Git","Git.Git","git-scm.com"),A(22,"GitHub Desktop","GitHub.GitHubDesktop","desktop.github.com"),A(23,"Python 3","Python.Python.3.13","python.org"),A(24,"Node.js LTS","OpenJS.NodeJS.LTS","nodejs.org"),A(25,"Docker Desktop","Docker.DockerDesktop","docker.com"),A(26,"Postman","Postman.Postman","postman.com"),A(27,"PyCharm Community","JetBrains.PyCharm.Community","jetbrains.com"),A(28,"IntelliJ IDEA Community","JetBrains.IntelliJIDEA.Community","jetbrains.com"),A(29,"Notepad++","Notepad++.Notepad++","notepad-plus-plus.org"),A(30,"Cisco Packet Tracer","url:https://www.netacad.com/learning-collections/cisco-packet-tracer","cisco.com"),A(31,"Blockbench","JannisX11.Blockbench","blockbench.net"),
        A(32,"LibreOffice","TheDocumentFoundation.LibreOffice","libreoffice.org"),A(33,"Obsidian","Obsidian.Obsidian","obsidian.md"),A(34,"Thunderbird","Mozilla.Thunderbird","thunderbird.net"),A(35,"Krita","KDE.Krita","krita.org"),A(36,"GIMP","GIMP.GIMP.3","gimp.org"),A(37,"Blender","BlenderFoundation.Blender","blender.org"),A(38,"Inkscape","Inkscape.Inkscape","inkscape.org"),A(39,"ShareX","ShareX.ShareX","getsharex.com"),A(40,"7-Zip","7zip.7zip","7-zip.org"),A(41,"PeaZip","Giorgiotani.Peazip","peazip.github.io"),A(42,"WinRAR","RARLab.WinRAR","rarlab.com"),A(43,"qBittorrent","qBittorrent.qBittorrent","qbittorrent.org"),A(44,"FileZilla","TimKosse.FileZilla.Client","filezilla-project.org"),A(45,"WinSCP","WinSCP.WinSCP","winscp.net"),A(46,"Bitwarden","Bitwarden.Bitwarden","bitwarden.com"),A(47,"KeePassXC","KeePassXCTeam.KeePassXC","keepassxc.org"),A(48,"Malwarebytes","Malwarebytes.Malwarebytes","malwarebytes.com"),
        A(49,"PowerToys","Microsoft.PowerToys","microsoft.com"),A(50,"Everything","voidtools.Everything","voidtools.com"),A(51,"WizTree","AntibodySoftware.WizTree","diskanalyzer.com"),A(52,"Rufus","Rufus.Rufus","rufus.ie"),A(53,"balenaEtcher","Balena.Etcher","balena.io"),A(54,"MiniTool Partition Wizard","MiniTool.PartitionWizard.Free","partitionwizard.com"),A(55,"HWiNFO","REALiX.HWiNFO","hwinfo.com"),A(56,"CPU-Z","CPUID.CPU-Z","cpuid.com"),A(57,"CrystalDiskInfo","CrystalDewWorld.CrystalDiskInfo","crystalmark.info"),A(58,"AnyDesk","AnyDeskSoftwareGmbH.AnyDesk","anydesk.com"),A(59,"TeamViewer","TeamViewer.TeamViewer","teamviewer.com"),A(60,"PuTTY","PuTTY.PuTTY","putty.org"),A(61,"RustDesk","RustDesk.RustDesk","rustdesk.com"),A(62,"Visual C++ Redistributable 2015–2022 x64","Microsoft.VCRedist.2015+.x64","microsoft.com"),A(63,".NET Desktop Runtime 8","Microsoft.DotNet.DesktopRuntime.8","dotnet.microsoft.com"),A(64,"Java 21 (Temurin JDK)","EclipseAdoptium.Temurin.21.JDK","adoptium.net"),A(65,"Java 17 (Temurin JDK)","EclipseAdoptium.Temurin.17.JDK","adoptium.net"),A(66,"NVIDIA Graphics Drivers","url:https://www.nvidia.com/Download/index.aspx","nvidia.com"),A(67,"NVIDIA App","url:https://www.nvidia.com/en-us/software/nvidia-app/","nvidia.com"),A(68,"AMD Radeon Drivers","url:https://www.amd.com/en/support/download/drivers.html","amd.com"),A(69,"AMD Software: Adrenalin Edition","url:https://www.amd.com/en/products/software/adrenalin.html","amd.com"),
        A(70,"Free Download Manager","SoftDeluxe.FreeDownloadManager","freedownloadmanager.org")
    };

    public MainForm()
    {
        selected = ReadSelection();
        Text = "AppForge Installer";
        StartPosition = FormStartPosition.CenterScreen;
        MinimumSize = new Size(920, 680);
        Size = new Size(1120, 820);
        BackColor = Bg;
        ForeColor = Text;
        Font = new Font("Segoe UI", 10f);
        DoubleBuffered = true;
        try { Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath); } catch { }
        BuildUi();
        Shown += async (_, _) => { if (selected.Count > 0) await ScanAsync(); };
    }

    void BuildUi()
    {
        var root = new TableLayoutPanel { Dock = DockStyle.Fill, Padding = new Padding(28), RowCount = 7, ColumnCount = 1, BackColor = Bg };
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.Percent, 100));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        Controls.Add(root);

        var header = new Panel { Dock = DockStyle.Fill, Height = 88, BackColor = Surface2, Padding = new Padding(22, 15, 22, 12), Margin = new Padding(0, 0, 0, 14) };
        var brand = new Label { AutoSize = true, Text = "APPFORGE", Font = new Font("Segoe UI", 10, FontStyle.Bold), ForeColor = Cyan, Location = new Point(22, 13) };
        var title = new Label { AutoSize = true, Text = "Your setup is ready", Font = new Font("Segoe UI", 25, FontStyle.Bold), ForeColor = Text, Location = new Point(20, 33) };
        var badge = new Label { AutoSize = true, Text = "  SAFE INSTALL  ", Font = new Font("Segoe UI", 8, FontStyle.Bold), ForeColor = Green, BackColor = Color.FromArgb(20, 62, 57), Location = new Point(850, 22), Padding = new Padding(7, 5, 7, 5) };
        header.Controls.AddRange([brand, title, badge]);
        root.Controls.Add(header);

        var sub = new Label
        {
            AutoSize = true,
            Text = selected.Count > 0 ? "AppForge checks only the apps you selected on the website. Missing apps install, outdated apps update, current apps stay untouched." : "No website selection found. Return to AppForge and download a fresh personalized installer.",
            ForeColor = Muted,
            MaximumSize = new Size(1000, 0),
            Margin = new Padding(2, 0, 0, 14)
        };
        root.Controls.Add(sub);

        var cards = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 3, RowCount = 1, AutoSize = true, Margin = new Padding(0, 0, 0, 14) };
        for (int i = 0; i < 3; i++) cards.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33.333f));
        cards.Controls.Add(MetricCard("SELECTED", selectedCard, selected.Count.ToString(), Cyan), 0, 0);
        cards.Controls.Add(MetricCard("ALREADY GOOD", goodCard, "—", Green), 1, 0);
        cards.Controls.Add(MetricCard("NEEDS ACTION", actionCard, "—", Yellow), 2, 0);
        root.Controls.Add(cards);

        var toolsRow = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 2, AutoSize = true, Margin = new Padding(0, 0, 0, 12) };
        toolsRow.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        toolsRow.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        summary.AutoSize = true;
        summary.Text = selected.Count > 0 ? "PC Health • waiting for scan…" : "Selection missing";
        summary.ForeColor = Cyan;
        summary.Font = new Font("Segoe UI", 10, FontStyle.Bold);
        summary.Anchor = AnchorStyles.Left;
        toolsRow.Controls.Add(summary, 0, 0);
        var tools = new FlowLayoutPanel { AutoSize = true, FlowDirection = FlowDirection.LeftToRight, Anchor = AnchorStyles.Right };
        StyleButton(scan, "↻  Scan again", false); StyleButton(retry, "Retry failed", false); StyleButton(copyErrors, "Copy errors", false); StyleButton(cancel, "Cancel", false);
        scan.Click += async (_, _) => await ScanAsync();
        retry.Click += async (_, _) => await FixAsync(true);
        copyErrors.Click += (_, _) => CopyErrors();
        cancel.Click += (_, _) => { cts?.Cancel(); try { active?.Kill(true); } catch { } };
        retry.Enabled = false; copyErrors.Enabled = false; cancel.Enabled = false;
        tools.Controls.AddRange([scan, retry, copyErrors, cancel]);
        toolsRow.Controls.Add(tools, 1, 0);
        root.Controls.Add(toolsRow);

        var listHost = new Panel { Dock = DockStyle.Fill, BackColor = Surface, Padding = new Padding(1), Margin = new Padding(0, 0, 0, 12) };
        appList.Dock = DockStyle.Fill;
        appList.FlowDirection = FlowDirection.TopDown;
        appList.WrapContents = false;
        appList.AutoScroll = true;
        appList.BackColor = Surface;
        appList.Padding = new Padding(12);
        listHost.Controls.Add(appList);
        root.Controls.Add(listHost);
        if (selected.Count > 0) foreach (var a in selected) AddRow(a);
        else appList.Controls.Add(new Label { Width = 940, Height = 120, Text = "Go back to AppForge → choose apps → Get my apps → download a fresh installer.", TextAlign = ContentAlignment.MiddleCenter, ForeColor = Muted });

        var progressArea = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 2, AutoSize = true, Margin = new Padding(0, 4, 0, 10) };
        progressArea.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        progressArea.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        overall.Dock = DockStyle.Fill; overall.Height = 15; overall.Style = ProgressBarStyle.Continuous;
        counter.AutoSize = true; counter.Text = $"0 / {selected.Count}"; counter.ForeColor = Muted; counter.Margin = new Padding(14, 0, 0, 0);
        progressArea.Controls.Add(overall, 0, 0); progressArea.Controls.Add(counter, 1, 0);
        root.Controls.Add(progressArea);

        var bottom = new Panel { Dock = DockStyle.Fill, Height = 62, BackColor = Surface2, Padding = new Padding(16, 10, 12, 10) };
        status.AutoSize = true; status.Text = selected.Count > 0 ? "Scanning selected apps…" : "Selection missing"; status.ForeColor = Muted; status.Location = new Point(16, 21);
        StyleButton(fix, "FIX MY SETUP  →", true); fix.Enabled = false; fix.Width = 190; fix.Height = 42; fix.Anchor = AnchorStyles.Top | AnchorStyles.Right; fix.Location = new Point(840, 10);
        fix.Click += async (_, _) => await FixAsync(false);
        bottom.Resize += (_, _) => fix.Left = bottom.ClientSize.Width - fix.Width - 12;
        bottom.Controls.AddRange([status, fix]);
        root.Controls.Add(bottom);
    }

    Control MetricCard(string title, Label value, string initial, Color accent)
    {
        var panel = new Panel { Height = 88, Dock = DockStyle.Fill, Margin = new Padding(4), BackColor = Surface2 };
        panel.Controls.Add(new Label { AutoSize = true, Text = title, ForeColor = Muted, Font = new Font("Segoe UI", 8, FontStyle.Bold), Location = new Point(16, 14) });
        value.AutoSize = true; value.Text = initial; value.ForeColor = accent; value.Font = new Font("Segoe UI", 22, FontStyle.Bold); value.Location = new Point(14, 34);
        panel.Controls.Add(value);
        return panel;
    }

    void StyleButton(Button b, string text, bool primary)
    {
        b.Text = text; b.AutoSize = !primary; b.Padding = new Padding(15, 8, 15, 8); b.FlatStyle = FlatStyle.Flat;
        b.FlatAppearance.BorderSize = primary ? 0 : 1; b.FlatAppearance.BorderColor = Border;
        b.BackColor = primary ? Cyan : Surface2; b.ForeColor = primary ? Color.FromArgb(5, 17, 29) : Text;
        b.Font = new Font("Segoe UI", 9.5f, primary ? FontStyle.Bold : FontStyle.Regular); b.Margin = new Padding(0, 0, 8, 0);
        b.Cursor = Cursors.Hand;
    }

    void AddRow(AppItem a)
    {
        var p = new Panel { Width = 970, Height = 78, Margin = new Padding(0, 0, 0, 7), BackColor = Surface2 };
        var pic = new PictureBox { Location = new Point(16, 15), Size = new Size(42, 42), SizeMode = PictureBoxSizeMode.Zoom, BackColor = Color.Transparent };
        var n = new Label { Text = a.Name, AutoSize = true, Location = new Point(74, 11), Font = new Font("Segoe UI", 10.5f, FontStyle.Bold), ForeColor = Text };
        var d = new Label { Text = a.PackageId.StartsWith("url:") ? "Official vendor page" : "Verified package • " + a.PackageId, AutoSize = true, Location = new Point(74, 34), Font = new Font("Segoe UI", 8.2f), ForeColor = Muted };
        var bar = new ProgressBar { Location = new Point(74, 59), Size = new Size(640, 8), Maximum = 100, Style = ProgressBarStyle.Continuous };
        var pct = new Label { Text = "0%", Location = new Point(720, 53), Width = 52, Height = 20, TextAlign = ContentAlignment.MiddleRight, ForeColor = Muted, Font = new Font("Segoe UI", 8.5f) };
        var st = new Label { Text = "Waiting", Location = new Point(790, 25), Width = 155, Height = 24, TextAlign = ContentAlignment.MiddleRight, ForeColor = Muted, Font = new Font("Segoe UI", 9, FontStyle.Bold) };
        states[a.Index] = st; bars[a.Index] = bar; percents[a.Index] = pct; health[a.Index] = AppHealth.Unknown;
        p.Controls.AddRange([pic, n, d, bar, pct, st]); appList.Controls.Add(p); _ = LoadIcon(pic, a.IconUrl);
    }

    static async Task LoadIcon(PictureBox b, string u)
    {
        try
        {
            var x = await Http.GetByteArrayAsync(u); using var ms = new MemoryStream(x); using var im = Image.FromStream(ms);
            if (!b.IsDisposed) b.Image = new Bitmap(im);
        }
        catch { }
    }

    async Task ScanAsync()
    {
        if (selected.Count == 0) return;
        SetBusy(true, "Scanning selected apps…"); errors.Clear();
        int missing = 0, current = 0, updates = 0, manual = 0, failed = 0, done = 0;
        overall.Maximum = selected.Count; overall.Value = 0;
        foreach (var a in selected)
        {
            if (a.PackageId.StartsWith("url:")) { health[a.Index] = AppHealth.Manual; manual++; SetState(a, 0, "Official page", Yellow); }
            else
            {
                try
                {
                    var list = await RunCapture("winget", $"list --id \"{a.PackageId}\" -e --accept-source-agreements --disable-interactivity");
                    if (!LooksInstalled(list)) { health[a.Index] = AppHealth.Missing; missing++; SetState(a, 0, "Missing ↓", Cyan); }
                    else
                    {
                        var up = await RunCapture("winget", $"upgrade --id \"{a.PackageId}\" -e --accept-source-agreements --disable-interactivity");
                        if (HasUpgrade(up)) { health[a.Index] = AppHealth.Update; updates++; SetState(a, 0, "Update available ↑", Yellow); }
                        else { health[a.Index] = AppHealth.Current; current++; SetState(a, 100, "Already good ✓", Green); }
                    }
                }
                catch (Exception ex) { health[a.Index] = AppHealth.Failed; failed++; errors[a.Index] = ex.Message; SetState(a, 0, "Scan failed", Red); }
            }
            done++; overall.Value = done; counter.Text = $"{done} / {selected.Count}";
        }
        goodCard.Text = current.ToString(); actionCard.Text = (missing + updates + manual + failed).ToString();
        summary.Text = $"PC Health • {current} good  •  {updates} updates  •  {missing} missing{(manual > 0 ? $"  •  {manual} manual" : "")}{(failed > 0 ? $"  •  {failed} failed" : "")}";
        fix.Enabled = missing + updates + manual > 0; retry.Enabled = failed > 0; copyErrors.Enabled = failed > 0;
        SetBusy(false, missing + updates + manual == 0 ? "Everything selected is already healthy ✓" : "Ready — AppForge will touch only items that need action.");
        WriteLog("SCAN", summary.Text);
    }

    static bool LooksInstalled(string s) => !string.IsNullOrWhiteSpace(s) && !s.Contains("No installed package found", StringComparison.OrdinalIgnoreCase) && !s.Contains("No package found", StringComparison.OrdinalIgnoreCase);
    static bool HasUpgrade(string s) => !string.IsNullOrWhiteSpace(s) && !s.Contains("No applicable upgrade found", StringComparison.OrdinalIgnoreCase) && !s.Contains("No available upgrade found", StringComparison.OrdinalIgnoreCase) && !s.Contains("No installed package found", StringComparison.OrdinalIgnoreCase) && s.Contains("Version", StringComparison.OrdinalIgnoreCase) && s.Contains("Available", StringComparison.OrdinalIgnoreCase);

    async Task FixAsync(bool failedOnly)
    {
        if (selected.Count == 0) return;
        cts = new(); errors.Clear(); SetBusy(true, "Fixing your setup…"); cancel.Enabled = true;
        var targets = failedOnly ? selected.Where(a => health.GetValueOrDefault(a.Index) == AppHealth.Failed).ToList() : selected.Where(a => health.GetValueOrDefault(a.Index) is AppHealth.Missing or AppHealth.Update or AppHealth.Manual or AppHealth.Failed).ToList();
        overall.Maximum = Math.Max(1, targets.Count); overall.Value = 0;
        int installed = 0, updated = 0, skipped = selected.Count - targets.Count, opened = 0, failed = 0, done = 0;
        foreach (var a in targets)
        {
            if (cts.IsCancellationRequested) break;
            try
            {
                var h = health.GetValueOrDefault(a.Index);
                if (a.PackageId.StartsWith("url:"))
                {
                    Process.Start(new ProcessStartInfo(a.PackageId[4..]) { UseShellExecute = true }); opened++; SetState(a, 100, "Official page opened", Yellow);
                }
                else
                {
                    string verb = h == AppHealth.Update ? "upgrade" : "install";
                    SetState(a, 0, verb == "upgrade" ? "Updating…" : "Installing…", Cyan);
                    var code = await RunWinget(a, verb, cts.Token);
                    if (code == 0)
                    {
                        if (verb == "upgrade") updated++; else installed++;
                        health[a.Index] = AppHealth.Current; SetState(a, 100, verb == "upgrade" ? "Updated ✓" : "Installed ✓", Green);
                    }
                    else { failed++; health[a.Index] = AppHealth.Failed; errors[a.Index] = $"Winget exit code {code}"; SetState(a, bars[a.Index].Value, "Failed ✕", Red); }
                }
            }
            catch (OperationCanceledException) { break; }
            catch (Exception ex) { failed++; health[a.Index] = AppHealth.Failed; errors[a.Index] = ex.Message; SetState(a, bars[a.Index].Value, "Failed ✕", Red); }
            done++; overall.Value = Math.Min(overall.Maximum, done); counter.Text = $"{done} / {targets.Count}";
        }
        cancel.Enabled = false;
        SetBusy(false, cts.IsCancellationRequested ? "Cancelled" : $"DONE — {installed} installed • {updated} updated • {skipped} untouched • {opened} manual • {failed} failed");
        summary.Text = status.Text; retry.Enabled = failed > 0; copyErrors.Enabled = failed > 0; fix.Enabled = false;
        goodCard.Text = selected.Count(a => health.GetValueOrDefault(a.Index) == AppHealth.Current).ToString();
        actionCard.Text = selected.Count(a => health.GetValueOrDefault(a.Index) is AppHealth.Missing or AppHealth.Update or AppHealth.Failed).ToString();
        WriteLog("FIX", status.Text);
    }

    async Task<int> RunWinget(AppItem a, string verb, CancellationToken token)
    {
        var args = $"{verb} --id \"{a.PackageId}\" -e --silent --accept-package-agreements --accept-source-agreements --disable-interactivity";
        var psi = new ProcessStartInfo("winget", args) { UseShellExecute = false, CreateNoWindow = true, RedirectStandardOutput = true, RedirectStandardError = true, StandardOutputEncoding = Encoding.UTF8, StandardErrorEncoding = Encoding.UTF8 };
        using var p = new Process { StartInfo = psi }; active = p; p.Start();
        var o = ReadProgress(p.StandardOutput, a, token); var e = ReadProgress(p.StandardError, a, token);
        await p.WaitForExitAsync(token); await Task.WhenAll(o, e); return p.ExitCode;
    }

    async Task ReadProgress(StreamReader r, AppItem a, CancellationToken t)
    {
        while (!r.EndOfStream && !t.IsCancellationRequested)
        {
            var line = await r.ReadLineAsync(t); if (string.IsNullOrWhiteSpace(line)) continue;
            var pct = ExtractPercent(line);
            if (pct.HasValue) BeginInvoke(() => SetState(a, pct.Value, $"Downloading {pct}%", Cyan));
            else if (line.Contains("Installing", StringComparison.OrdinalIgnoreCase)) BeginInvoke(() => SetState(a, bars[a.Index].Value, "Installing…", Cyan));
        }
    }

    static async Task<string> RunCapture(string file, string args)
    {
        var psi = new ProcessStartInfo(file, args) { UseShellExecute = false, CreateNoWindow = true, RedirectStandardOutput = true, RedirectStandardError = true };
        using var p = Process.Start(psi) ?? throw new Exception("Could not start Windows Package Manager.");
        var o = await p.StandardOutput.ReadToEndAsync(); var e = await p.StandardError.ReadToEndAsync(); await p.WaitForExitAsync(); return o + "\n" + e;
    }

    static int? ExtractPercent(string s)
    {
        var m = PercentRegex.Match(s); if (m.Success && int.TryParse(m.Groups[1].Value, out var x)) return Math.Clamp(x, 0, 100);
        var z = SizeRegex.Match(s); if (!z.Success) return null;
        if (!double.TryParse(z.Groups["done"].Value.Replace(',', '.'), System.Globalization.NumberStyles.Float, System.Globalization.CultureInfo.InvariantCulture, out var d) || !double.TryParse(z.Groups["total"].Value.Replace(',', '.'), System.Globalization.NumberStyles.Float, System.Globalization.CultureInfo.InvariantCulture, out var t)) return null;
        double U(string u) => u.ToUpperInvariant() switch { "GB" => 1048576, "MB" => 1024, _ => 1 };
        d *= U(z.Groups["du"].Value); t *= U(z.Groups["tu"].Value); return t <= 0 ? null : Math.Clamp((int)Math.Round(d / t * 100), 0, 100);
    }

    void SetState(AppItem a, int pct, string text, Color c)
    {
        if (bars.TryGetValue(a.Index, out var b)) b.Value = Math.Clamp(pct, 0, 100);
        if (percents.TryGetValue(a.Index, out var p)) p.Text = $"{Math.Clamp(pct, 0, 100)}%";
        if (states.TryGetValue(a.Index, out var s)) { s.Text = text; s.ForeColor = c; }
        status.Text = $"{a.Name} • {text}";
    }

    void SetBusy(bool busy, string text)
    {
        scan.Enabled = !busy; if (busy) fix.Enabled = false; status.Text = text; UseWaitCursor = busy;
    }

    void CopyErrors()
    {
        if (errors.Count == 0) return;
        var text = string.Join(Environment.NewLine, errors.Select(kv => $"{Catalog.First(a => a.Index == kv.Key).Name}: {kv.Value}"));
        try { Clipboard.SetText(text); status.Text = "Errors copied ✓"; } catch { status.Text = "Could not copy errors"; }
    }

    static void WriteLog(string type, string text)
    {
        try
        {
            var dir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "AppForge"); Directory.CreateDirectory(dir);
            File.AppendAllText(Path.Combine(dir, "history.log"), $"{DateTime.Now:yyyy-MM-dd HH:mm:ss} [{type}] {text}{Environment.NewLine}");
        }
        catch { }
    }

    static List<AppItem> ReadSelection()
    {
        try
        {
            var n = Path.GetFileNameWithoutExtension(Application.ExecutablePath); const string pre = "AppForge-";
            if (n.StartsWith(pre, StringComparison.OrdinalIgnoreCase))
            {
                var token = n[pre.Length..];
                var paren = token.IndexOf(" ("); if (paren >= 0) token = token[..paren];
                token = token.Replace('-', '+').Replace('_', '/'); token += (token.Length % 4) switch { 2 => "==", 3 => "=", _ => "" };
                var bits = Convert.FromBase64String(token); var ids = new HashSet<int>();
                for (int i = 0; i < bits.Length * 8; i++) if ((bits[i / 8] & (1 << (i % 8))) != 0) ids.Add(i);
                var r = Catalog.Where(a => ids.Contains(a.Index)).ToList(); if (r.Count > 0) return r;
            }
        }
        catch { }
        try
        {
            var bytes = File.ReadAllBytes(Application.ExecutablePath); var marker = Encoding.UTF8.GetBytes("\nAPPFORGE_SELECTION_V1:"); var end = Encoding.UTF8.GetBytes(":END\n");
            int s = Last(bytes, marker); if (s < 0) return []; s += marker.Length; int e = Find(bytes, end, s); if (e <= s) return [];
            var ids = Encoding.UTF8.GetString(bytes, s, e - s).Split('.', StringSplitOptions.RemoveEmptyEntries).Select(x => int.TryParse(x, out var i) ? i : -1).Where(i => i >= 0).ToHashSet();
            return Catalog.Where(a => ids.Contains(a.Index)).ToList();
        }
        catch { return []; }
    }

    static int Last(byte[] s, byte[] p) { for (int i = s.Length - p.Length; i >= 0; i--) { bool ok = true; for (int j = 0; j < p.Length; j++) if (s[i + j] != p[j]) { ok = false; break; } if (ok) return i; } return -1; }
    static int Find(byte[] s, byte[] p, int start) { for (int i = start; i <= s.Length - p.Length; i++) { bool ok = true; for (int j = 0; j < p.Length; j++) if (s[i + j] != p[j]) { ok = false; break; } if (ok) return i; } return -1; }
}
