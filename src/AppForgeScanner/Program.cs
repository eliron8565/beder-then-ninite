using System.Diagnostics;
using System.Net.NetworkInformation;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace AppForgeScanner;

internal static class Program
{
    [STAThread]
    static void Main()
    {
        ApplicationConfiguration.Initialize();
        Application.Run(new ScannerForm());
    }
}

internal sealed class ScannerForm : Form
{
    private readonly Label status = new();
    private readonly Label healthScore = new();
    private readonly Label osValue = new();
    private readonly Label networkValue = new();
    private readonly Label diskValue = new();
    private readonly Label wingetValue = new();
    private readonly Label installedValue = new();
    private readonly Label updatesValue = new();
    private readonly TextBox reportBox = new();
    private readonly ProgressBar scanProgress = new();
    private readonly Button scanButton = new();
    private readonly Button updateButton = new();
    private readonly Button copyButton = new();
    private readonly Button appForgeButton = new();
    private readonly List<string> detectedPackageIds = new();
    private string lastReport = "";
    private bool wingetAvailable;
    private int detectedUpdates;
    private bool updateCompleted;

    private static readonly Color Bg = Color.FromArgb(5, 11, 22);
    private static readonly Color Panel = Color.FromArgb(13, 25, 42);
    private static readonly Color Panel2 = Color.FromArgb(17, 34, 56);
    private static readonly Color Line = Color.FromArgb(39, 67, 96);
    private static readonly Color Text = Color.FromArgb(240, 246, 255);
    private static readonly Color Muted = Color.FromArgb(145, 164, 187);
    private static readonly Color Cyan = Color.FromArgb(88, 220, 255);
    private static readonly Color Purple = Color.FromArgb(139, 111, 255);
    private static readonly Color Green = Color.FromArgb(112, 232, 179);
    private static readonly Color Amber = Color.FromArgb(247, 199, 95);

    public ScannerForm()
    {
        Text = "AppForge PC Scanner";
        StartPosition = FormStartPosition.CenterScreen;
        MinimumSize = new Size(920, 680);
        Size = new Size(1120, 820);
        BackColor = Bg;
        ForeColor = Text;
        Font = new Font("Segoe UI", 10f);
        try { Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath); } catch { }
        BuildUi();
        Shown += async (_, _) => await ScanAsync();
    }

    private void BuildUi()
    {
        var root = new TableLayoutPanel { Dock = DockStyle.Fill, Padding = new Padding(28), RowCount = 7, ColumnCount = 1, BackColor = Bg };
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.Percent, 100));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        Controls.Add(root);

        var header = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 2, AutoSize = true, Margin = new Padding(0, 0, 0, 18) };
        header.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        header.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        var brand = new FlowLayoutPanel { AutoSize = true, FlowDirection = FlowDirection.TopDown, WrapContents = false };
        brand.Controls.Add(new Label { AutoSize = true, Text = "AppForge PC Scanner", Font = new Font("Segoe UI", 30, FontStyle.Bold), ForeColor = Text });
        brand.Controls.Add(new Label { AutoSize = true, Text = "Smart scan • Safe updates • Only touches what the scan finds", Font = new Font("Segoe UI", 10f), ForeColor = Muted, Margin = new Padding(2, 2, 0, 0) });
        header.Controls.Add(brand, 0, 0);

        var scoreCard = new Panel { Width = 170, Height = 72, BackColor = Panel2, Margin = new Padding(12, 0, 0, 0) };
        scoreCard.Controls.Add(new Label { Text = "PC HEALTH", AutoSize = true, Location = new Point(14, 10), ForeColor = Muted, Font = new Font("Segoe UI", 8.5f, FontStyle.Bold) });
        healthScore.Text = "SCANNING";
        healthScore.AutoSize = true;
        healthScore.Location = new Point(14, 31);
        healthScore.Font = new Font("Segoe UI", 17f, FontStyle.Bold);
        healthScore.ForeColor = Cyan;
        scoreCard.Controls.Add(healthScore);
        header.Controls.Add(scoreCard, 1, 0);
        root.Controls.Add(header);

        var statusPanel = new Panel { Height = 46, Dock = DockStyle.Fill, BackColor = Panel, Margin = new Padding(0, 0, 0, 16) };
        status.AutoSize = true;
        status.Text = "● Ready to scan";
        status.ForeColor = Cyan;
        status.Font = new Font("Segoe UI", 10f, FontStyle.Bold);
        status.Location = new Point(14, 13);
        statusPanel.Controls.Add(status);
        root.Controls.Add(statusPanel);

        root.Controls.Add(new Label { AutoSize = true, Text = "SYSTEM OVERVIEW", ForeColor = Muted, Font = new Font("Segoe UI", 8.5f, FontStyle.Bold), Margin = new Padding(2, 0, 0, 8) });

        var cards = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 3, RowCount = 2, AutoSize = true, Margin = new Padding(0, 0, 0, 14) };
        for (var i = 0; i < 3; i++) cards.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33.333f));
        cards.Controls.Add(Card("WINDOWS", "▣", osValue), 0, 0);
        cards.Controls.Add(Card("INTERNET", "◉", networkValue), 1, 0);
        cards.Controls.Add(Card("SYSTEM DRIVE", "◆", diskValue), 2, 0);
        cards.Controls.Add(Card("WINGET", "⌁", wingetValue), 0, 1);
        cards.Controls.Add(Card("INSTALLED", "▦", installedValue), 1, 1);
        cards.Controls.Add(Card("UPDATES", "↻", updatesValue), 2, 1);
        root.Controls.Add(cards);

        scanProgress.Dock = DockStyle.Fill;
        scanProgress.Height = 7;
        scanProgress.Style = ProgressBarStyle.Marquee;
        scanProgress.MarqueeAnimationSpeed = 28;
        scanProgress.Margin = new Padding(0, 0, 0, 12);
        root.Controls.Add(scanProgress);

        var reportShell = new Panel { Dock = DockStyle.Fill, BackColor = Panel, Padding = new Padding(1), Margin = new Padding(0, 0, 0, 14) };
        reportBox.Dock = DockStyle.Fill;
        reportBox.Multiline = true;
        reportBox.ReadOnly = true;
        reportBox.ScrollBars = ScrollBars.Vertical;
        reportBox.BackColor = Color.FromArgb(7, 16, 29);
        reportBox.ForeColor = Color.FromArgb(210, 225, 242);
        reportBox.BorderStyle = BorderStyle.None;
        reportBox.Font = new Font("Cascadia Mono", 9.5f);
        reportBox.Padding = new Padding(8);
        reportShell.Controls.Add(reportBox);
        root.Controls.Add(reportShell);

        var buttons = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 5, AutoSize = true };
        buttons.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        buttons.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        buttons.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        buttons.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        buttons.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));

        appForgeButton.Text = "OPEN APPFORGE";
        StyleSecondary(appForgeButton);
        appForgeButton.Click += (_, _) => Process.Start(new ProcessStartInfo("https://eliron8565.github.io/beder-then-ninite/") { UseShellExecute = true });

        copyButton.Text = "COPY REPORT";
        StyleSecondary(copyButton);
        copyButton.Enabled = false;
        copyButton.Click += (_, _) => { if (!string.IsNullOrWhiteSpace(lastReport)) Clipboard.SetText(lastReport); };

        scanButton.Text = "SCAN AGAIN";
        StyleSecondary(scanButton);
        scanButton.Click += async (_, _) => await ScanAsync();

        updateButton.Text = "UPDATE NOW";
        StylePrimary(updateButton);
        updateButton.Enabled = false;
        updateButton.Click += async (_, _) => { if (updateCompleted) await ScanAsync(); else await UpdateNowAsync(); };

        buttons.Controls.Add(new Panel { Dock = DockStyle.Fill }, 0, 0);
        buttons.Controls.Add(appForgeButton, 1, 0);
        buttons.Controls.Add(copyButton, 2, 0);
        buttons.Controls.Add(scanButton, 3, 0);
        buttons.Controls.Add(updateButton, 4, 0);
        root.Controls.Add(buttons);
    }

    private static Control Card(string name, string glyph, Label value)
    {
        var panel = new Panel { Height = 112, Dock = DockStyle.Fill, Margin = new Padding(5), BackColor = Panel2 };
        panel.Controls.Add(new Label { Text = glyph, AutoSize = true, Location = new Point(16, 16), ForeColor = Cyan, Font = new Font("Segoe UI Symbol", 15f, FontStyle.Bold) });
        panel.Controls.Add(new Label { Text = name, AutoSize = true, Location = new Point(48, 18), ForeColor = Muted, Font = new Font("Segoe UI", 8.5f, FontStyle.Bold) });
        value.Text = "—";
        value.AutoSize = true;
        value.Location = new Point(16, 54);
        value.Font = new Font("Segoe UI", 15f, FontStyle.Bold);
        value.ForeColor = Text;
        panel.Controls.Add(value);
        return panel;
    }

    private static void StylePrimary(Button button)
    {
        button.AutoSize = true; button.Padding = new Padding(24, 11, 24, 11); button.FlatStyle = FlatStyle.Flat;
        button.FlatAppearance.BorderSize = 0; button.BackColor = Green; button.ForeColor = Color.FromArgb(4, 20, 19);
        button.Font = new Font("Segoe UI", 9.5f, FontStyle.Bold); button.Margin = new Padding(8, 0, 0, 0);
    }

    private static void StyleSecondary(Button button)
    {
        button.AutoSize = true; button.Padding = new Padding(16, 10, 16, 10); button.FlatStyle = FlatStyle.Flat;
        button.FlatAppearance.BorderColor = Line; button.FlatAppearance.BorderSize = 1; button.BackColor = Panel; button.ForeColor = Text;
        button.Font = new Font("Segoe UI", 9f, FontStyle.Bold); button.Margin = new Padding(8, 0, 0, 0);
    }

    private async Task ScanAsync()
    {
        updateCompleted = false;
        scanButton.Enabled = false;
        updateButton.Enabled = false;
        copyButton.Enabled = false;
        detectedPackageIds.Clear();
        detectedUpdates = 0;
        wingetAvailable = false;
        status.Text = "● Scanning your PC…";
        healthScore.Text = "SCANNING";
        healthScore.ForeColor = Cyan;
        reportBox.Text = "Scanning system…";
        scanProgress.Style = ProgressBarStyle.Marquee;
        scanProgress.MarqueeAnimationSpeed = 28;

        var lines = new List<string>();
        try
        {
            var os = Environment.OSVersion.VersionString;
            osValue.Text = Environment.OSVersion.Version.Build >= 22000 ? "Windows 11" : "Windows";
            lines.Add($"OS: {os}");

            var online = NetworkInterface.GetIsNetworkAvailable();
            networkValue.Text = online ? "Online ✓" : "Offline ⚠";
            networkValue.ForeColor = online ? Green : Amber;
            lines.Add($"Internet: {(online ? "available" : "not detected")}");

            var rootPath = Path.GetPathRoot(Environment.SystemDirectory) ?? "C:\\";
            var drive = new DriveInfo(rootPath);
            var freeGb = Math.Round(drive.AvailableFreeSpace / 1024d / 1024d / 1024d, 1);
            diskValue.Text = $"{freeGb} GB free";
            diskValue.ForeColor = freeGb >= 10 ? Green : Amber;
            lines.Add($"System drive free space: {freeGb} GB");

            var wingetVersion = await RunCaptureAsync("winget", "--version", 15000);
            wingetAvailable = wingetVersion.ExitCode == 0;
            wingetValue.Text = wingetAvailable ? wingetVersion.Output.Trim() : "Not available";
            wingetValue.ForeColor = wingetAvailable ? Green : Color.FromArgb(255, 120, 130);
            lines.Add($"Winget: {(wingetAvailable ? wingetVersion.Output.Trim() : "not available")}");

            var installedCount = 0;
            var updateNames = new List<string>();

            if (wingetAvailable)
            {
                status.Text = "● Reading installed apps…";
                var temp = Path.Combine(Path.GetTempPath(), $"appforge-export-{Guid.NewGuid():N}.json");
                var export = await RunCaptureAsync("winget", $"export -o \"{temp}\" --include-versions --accept-source-agreements --disable-interactivity", 60000);
                if (export.ExitCode == 0 && File.Exists(temp))
                {
                    try
                    {
                        using var doc = JsonDocument.Parse(await File.ReadAllTextAsync(temp));
                        if (doc.RootElement.TryGetProperty("Sources", out var sources))
                            foreach (var source in sources.EnumerateArray())
                                if (source.TryGetProperty("Packages", out var packages)) installedCount += packages.GetArrayLength();
                    }
                    catch { }
                    try { File.Delete(temp); } catch { }
                }

                status.Text = "● Checking for updates…";
                var upgrades = await RunCaptureAsync("winget", "upgrade --accept-source-agreements --disable-interactivity", 90000);
                ParseWingetUpgradeTable(upgrades.Output, updateNames, detectedPackageIds);
                detectedUpdates = detectedPackageIds.Count;
            }

            installedValue.Text = installedCount > 0 ? installedCount.ToString() : "Detected";
            updatesValue.Text = detectedUpdates.ToString();
            updatesValue.ForeColor = detectedUpdates == 0 ? Green : Amber;
            lines.Add($"Installed packages detected: {installedCount}");
            lines.Add($"Updates detected: {detectedUpdates}");

            if (updateNames.Count > 0)
            {
                lines.Add("");
                lines.Add("UPDATE CANDIDATES:");
                lines.AddRange(updateNames.Take(40));
            }

            lines.Add("");
            lines.Add("SAFE UPDATE RULE: only items detected by this scan can be updated.");
            lines.Add("Unrelated apps and drivers are left untouched.");

            lastReport = string.Join(Environment.NewLine, lines);
            reportBox.Text = lastReport;
            copyButton.Enabled = true;
            updateButton.Enabled = wingetAvailable && online && detectedPackageIds.Count > 0;
            updateButton.Text = detectedPackageIds.Count > 0 ? $"UPDATE NOW  •  {detectedPackageIds.Count}" : "NO UPDATES";
            status.Text = detectedPackageIds.Count > 0 ? $"● Scan complete — {detectedPackageIds.Count} update(s) found" : "● Scan complete — system looks good ✓";

            var score = 100;
            if (!online) score -= 20;
            if (!wingetAvailable) score -= 20;
            if (freeGb < 10) score -= 15;
            score -= Math.Min(30, detectedPackageIds.Count * 3);
            score = Math.Max(0, score);
            healthScore.Text = $"{score}/100";
            healthScore.ForeColor = score >= 90 ? Green : score >= 70 ? Amber : Color.FromArgb(255, 120, 130);
        }
        catch (Exception ex)
        {
            lastReport = string.Join(Environment.NewLine, lines) + Environment.NewLine + $"Scan error: {ex.Message}";
            reportBox.Text = lastReport;
            copyButton.Enabled = true;
            status.Text = "● Scan finished with a warning";
            healthScore.Text = "CHECK";
            healthScore.ForeColor = Amber;
        }
        finally
        {
            scanButton.Enabled = true;
            scanProgress.Style = ProgressBarStyle.Continuous;
            scanProgress.MarqueeAnimationSpeed = 0;
            scanProgress.Value = 100;
        }
    }

    private static void ParseWingetUpgradeTable(string output, List<string> displayRows, List<string> ids)
    {
        if (string.IsNullOrWhiteSpace(output)) return;
        var inTable = false;
        foreach (var raw in output.Split('\n'))
        {
            var line = raw.TrimEnd('\r', ' ');
            var trimmed = line.Trim();
            if (trimmed.Length >= 5 && trimmed.All(c => c == '-')) { inTable = true; continue; }
            if (!inTable || string.IsNullOrWhiteSpace(trimmed)) continue;
            if (trimmed.Contains("upgrades available", StringComparison.OrdinalIgnoreCase) || trimmed.StartsWith("The following", StringComparison.OrdinalIgnoreCase)) continue;

            var cols = Regex.Split(trimmed, @"\s{2,}").Where(x => !string.IsNullOrWhiteSpace(x)).ToArray();
            if (cols.Length < 4) continue;

            var id = cols[1].Trim();
            if (id.Contains('.') && !ids.Contains(id, StringComparer.OrdinalIgnoreCase))
            {
                ids.Add(id);
                displayRows.Add(trimmed);
            }
        }
    }

    private async Task UpdateNowAsync()
    {
        if (!NetworkInterface.GetIsNetworkAvailable())
        {
            MessageBox.Show("No internet connection was detected.", "AppForge PC Scanner", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            return;
        }

        if (!wingetAvailable || detectedPackageIds.Count == 0)
        {
            MessageBox.Show("The scan did not find any supported updates to install.", "AppForge PC Scanner", MessageBoxButtons.OK, MessageBoxIcon.Information);
            return;
        }

        scanButton.Enabled = false;
        updateButton.Enabled = false;
        copyButton.Enabled = false;
        scanProgress.Style = ProgressBarStyle.Continuous;
        scanProgress.Minimum = 0;
        scanProgress.Maximum = detectedPackageIds.Count;
        scanProgress.Value = 0;
        reportBox.AppendText(Environment.NewLine + Environment.NewLine + "=== SAFE UPDATE ===" + Environment.NewLine);
        reportBox.AppendText("Only scan-detected updates will be changed." + Environment.NewLine);

        var success = 0;
        var failed = 0;
        var completed = 0;
        foreach (var packageId in detectedPackageIds.ToList())
        {
            status.Text = $"● Updating {packageId}…";
            reportBox.AppendText($"> {packageId}{Environment.NewLine}");
            var result = await RunCaptureAsync("winget", $"upgrade --id \"{packageId}\" -e --silent --accept-package-agreements --accept-source-agreements --disable-interactivity", 10 * 60 * 1000);
            if (result.ExitCode == 0)
            {
                success++;
                reportBox.AppendText("  Updated ✓" + Environment.NewLine);
            }
            else
            {
                failed++;
                reportBox.AppendText("  Failed ⚠" + Environment.NewLine);
                if (!string.IsNullOrWhiteSpace(result.Output)) reportBox.AppendText("  " + result.Output.Trim().Replace(Environment.NewLine, Environment.NewLine + "  ") + Environment.NewLine);
            }
            completed++;
            scanProgress.Value = completed;
        }

        status.Text = failed == 0 ? $"● Done — {success} update(s) installed ✓" : $"● Done — {success} updated, {failed} failed";
        lastReport = reportBox.Text;
        copyButton.Enabled = true;
        scanButton.Enabled = true;
        updateCompleted = true;
        updateButton.Text = "SCAN AGAIN";
        updateButton.Enabled = true;
        healthScore.Text = failed == 0 ? "UPDATED" : "CHECK";
        healthScore.ForeColor = failed == 0 ? Green : Amber;
    }

    private static async Task<(int ExitCode, string Output)> RunCaptureAsync(string file, string args, int timeoutMs)
    {
        try
        {
            var psi = new ProcessStartInfo(file, args)
            {
                UseShellExecute = false,
                CreateNoWindow = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                StandardOutputEncoding = Encoding.UTF8,
                StandardErrorEncoding = Encoding.UTF8
            };
            using var process = new Process { StartInfo = psi };
            process.Start();
            using var cts = new CancellationTokenSource(timeoutMs);
            var outputTask = process.StandardOutput.ReadToEndAsync(cts.Token);
            var errorTask = process.StandardError.ReadToEndAsync(cts.Token);
            await process.WaitForExitAsync(cts.Token);
            var output = await outputTask;
            var error = await errorTask;
            return (process.ExitCode, string.IsNullOrWhiteSpace(output) ? error : output + (string.IsNullOrWhiteSpace(error) ? "" : Environment.NewLine + error));
        }
        catch (OperationCanceledException) { return (-2, "Timed out"); }
        catch (Exception ex) { return (-1, ex.Message); }
    }
}
