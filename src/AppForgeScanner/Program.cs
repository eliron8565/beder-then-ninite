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
    private readonly Label osValue = new();
    private readonly Label networkValue = new();
    private readonly Label diskValue = new();
    private readonly Label wingetValue = new();
    private readonly Label installedValue = new();
    private readonly Label updatesValue = new();
    private readonly TextBox reportBox = new();
    private readonly Button scanButton = new();
    private readonly Button updateButton = new();
    private readonly Button copyButton = new();
    private readonly Button appForgeButton = new();
    private readonly List<string> detectedPackageIds = new();
    private string lastReport = "";
    private bool wingetAvailable;
    private int detectedUpdates;

    public ScannerForm()
    {
        Text = "AppForge PC Scanner";
        StartPosition = FormStartPosition.CenterScreen;
        MinimumSize = new Size(840, 620);
        Size = new Size(1020, 740);
        BackColor = Color.FromArgb(7, 15, 27);
        ForeColor = Color.White;
        Font = new Font("Segoe UI", 10f);
        BuildUi();
        Shown += async (_, _) => await ScanAsync();
    }

    private void BuildUi()
    {
        var root = new TableLayoutPanel { Dock = DockStyle.Fill, Padding = new Padding(28), RowCount = 5, ColumnCount = 1, BackColor = BackColor };
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.Percent, 100));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        Controls.Add(root);

        root.Controls.Add(new Label { AutoSize = true, Text = "AppForge PC Scanner", Font = new Font("Segoe UI", 28, FontStyle.Bold), ForeColor = Color.White });

        status.AutoSize = true;
        status.Text = "Ready to scan";
        status.ForeColor = Color.FromArgb(103, 210, 255);
        status.Margin = new Padding(0, 4, 0, 18);
        root.Controls.Add(status);

        var cards = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 3, RowCount = 2, AutoSize = true };
        for (var i = 0; i < 3; i++) cards.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33.333f));
        cards.Controls.Add(Card("Windows", osValue), 0, 0);
        cards.Controls.Add(Card("Internet", networkValue), 1, 0);
        cards.Controls.Add(Card("System drive", diskValue), 2, 0);
        cards.Controls.Add(Card("Winget", wingetValue), 0, 1);
        cards.Controls.Add(Card("Installed packages", installedValue), 1, 1);
        cards.Controls.Add(Card("Updates found", updatesValue), 2, 1);
        root.Controls.Add(cards);

        reportBox.Dock = DockStyle.Fill;
        reportBox.Multiline = true;
        reportBox.ReadOnly = true;
        reportBox.ScrollBars = ScrollBars.Vertical;
        reportBox.BackColor = Color.FromArgb(10, 22, 37);
        reportBox.ForeColor = Color.FromArgb(220, 232, 245);
        reportBox.BorderStyle = BorderStyle.FixedSingle;
        reportBox.Font = new Font("Consolas", 10f);
        reportBox.Margin = new Padding(0, 18, 0, 14);
        root.Controls.Add(reportBox);

        var buttons = new FlowLayoutPanel { Dock = DockStyle.Fill, FlowDirection = FlowDirection.RightToLeft, AutoSize = true };

        scanButton.Text = "SCAN PC";
        StylePrimary(scanButton);
        scanButton.Click += async (_, _) => await ScanAsync();

        updateButton.Text = "UPDATE NOW";
        StyleUpdate(updateButton);
        updateButton.Enabled = false;
        updateButton.Click += async (_, _) => await UpdateNowAsync();

        copyButton.Text = "Copy report";
        StyleSecondary(copyButton);
        copyButton.Enabled = false;
        copyButton.Click += (_, _) => { if (!string.IsNullOrWhiteSpace(lastReport)) Clipboard.SetText(lastReport); };

        appForgeButton.Text = "Open AppForge";
        StyleSecondary(appForgeButton);
        appForgeButton.Click += (_, _) => Process.Start(new ProcessStartInfo("https://eliron8565.github.io/beder-then-ninite/") { UseShellExecute = true });

        buttons.Controls.Add(scanButton);
        buttons.Controls.Add(updateButton);
        buttons.Controls.Add(copyButton);
        buttons.Controls.Add(appForgeButton);
        root.Controls.Add(buttons);
    }

    private static Control Card(string name, Label value)
    {
        var panel = new Panel { Height = 105, Dock = DockStyle.Fill, Margin = new Padding(5), BackColor = Color.FromArgb(16, 31, 50) };
        panel.Controls.Add(new Label { Text = name, AutoSize = true, Location = new Point(16, 14), ForeColor = Color.FromArgb(140, 157, 179), Font = new Font("Segoe UI", 9f) });
        value.Text = "—";
        value.AutoSize = true;
        value.Location = new Point(16, 44);
        value.Font = new Font("Segoe UI", 14f, FontStyle.Bold);
        value.ForeColor = Color.White;
        panel.Controls.Add(value);
        return panel;
    }

    private static void StylePrimary(Button button)
    {
        button.AutoSize = true; button.Padding = new Padding(22, 10, 22, 10); button.FlatStyle = FlatStyle.Flat;
        button.FlatAppearance.BorderSize = 0; button.BackColor = Color.FromArgb(82, 219, 255); button.ForeColor = Color.FromArgb(5, 17, 29);
        button.Font = new Font("Segoe UI", 10f, FontStyle.Bold); button.Margin = new Padding(8, 0, 0, 0);
    }

    private static void StyleUpdate(Button button)
    {
        button.AutoSize = true; button.Padding = new Padding(22, 10, 22, 10); button.FlatStyle = FlatStyle.Flat;
        button.FlatAppearance.BorderSize = 0; button.BackColor = Color.FromArgb(111, 231, 183); button.ForeColor = Color.FromArgb(5, 17, 29);
        button.Font = new Font("Segoe UI", 10f, FontStyle.Bold); button.Margin = new Padding(8, 0, 0, 0);
    }

    private static void StyleSecondary(Button button)
    {
        button.AutoSize = true; button.Padding = new Padding(16, 9, 16, 9); button.FlatStyle = FlatStyle.Flat;
        button.FlatAppearance.BorderColor = Color.FromArgb(53, 70, 92); button.BackColor = Color.FromArgb(14, 27, 45); button.ForeColor = Color.White;
        button.Margin = new Padding(8, 0, 0, 0);
    }

    private async Task ScanAsync()
    {
        scanButton.Enabled = false;
        updateButton.Enabled = false;
        copyButton.Enabled = false;
        detectedPackageIds.Clear();
        detectedUpdates = 0;
        wingetAvailable = false;
        status.Text = "Scanning your PC…";
        reportBox.Text = "Scanning…";

        var lines = new List<string>();
        try
        {
            var os = Environment.OSVersion.VersionString;
            osValue.Text = Environment.OSVersion.Version.Build >= 22000 ? "Windows 11" : "Windows";
            lines.Add($"OS: {os}");

            var online = NetworkInterface.GetIsNetworkAvailable();
            networkValue.Text = online ? "Online ✓" : "Offline ⚠";
            networkValue.ForeColor = online ? Color.FromArgb(111, 231, 183) : Color.FromArgb(255, 160, 100);
            lines.Add($"Internet: {(online ? "available" : "not detected")}");

            var rootPath = Path.GetPathRoot(Environment.SystemDirectory) ?? "C:\\";
            var drive = new DriveInfo(rootPath);
            var freeGb = Math.Round(drive.AvailableFreeSpace / 1024d / 1024d / 1024d, 1);
            diskValue.Text = $"{freeGb} GB free";
            diskValue.ForeColor = freeGb >= 10 ? Color.FromArgb(111, 231, 183) : Color.FromArgb(255, 160, 100);
            lines.Add($"System drive free space: {freeGb} GB");

            var wingetVersion = await RunCaptureAsync("winget", "--version", 15000);
            wingetAvailable = wingetVersion.ExitCode == 0;
            wingetValue.Text = wingetAvailable ? wingetVersion.Output.Trim() : "Not available";
            wingetValue.ForeColor = wingetAvailable ? Color.FromArgb(111, 231, 183) : Color.FromArgb(255, 120, 130);
            lines.Add($"Winget: {(wingetAvailable ? wingetVersion.Output.Trim() : "not available")}");

            var installedCount = 0;
            var updateNames = new List<string>();

            if (wingetAvailable)
            {
                status.Text = "Reading installed apps…";
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

                status.Text = "Checking for app updates…";
                var upgrades = await RunCaptureAsync("winget", "upgrade --accept-source-agreements --disable-interactivity", 90000);
                ParseWingetUpgradeTable(upgrades.Output, updateNames, detectedPackageIds);
                detectedUpdates = detectedPackageIds.Count;
            }

            installedValue.Text = installedCount > 0 ? installedCount.ToString() : "Detected";
            updatesValue.Text = detectedUpdates.ToString();
            updatesValue.ForeColor = detectedUpdates == 0 ? Color.FromArgb(111, 231, 183) : Color.FromArgb(244, 196, 95);
            lines.Add($"Installed packages detected: {installedCount}");
            lines.Add($"Updates detected: {detectedUpdates}");

            if (updateNames.Count > 0)
            {
                lines.Add("");
                lines.Add("UPDATE CANDIDATES:");
                lines.AddRange(updateNames.Take(40));
            }

            lines.Add("");
            lines.Add("UPDATE NOW only updates items that this scan explicitly detected as outdated.");
            lines.Add("It does NOT run a blanket update-all and does NOT touch unrelated apps or drivers.");

            lastReport = string.Join(Environment.NewLine, lines);
            reportBox.Text = lastReport;
            copyButton.Enabled = true;
            updateButton.Enabled = wingetAvailable && online && detectedPackageIds.Count > 0;
            updateButton.Text = detectedPackageIds.Count > 0 ? $"UPDATE NOW ({detectedPackageIds.Count})" : "NO UPDATES";
            status.Text = detectedPackageIds.Count > 0 ? $"Scan complete — {detectedPackageIds.Count} update(s) found" : "Scan complete — looking good ✓";
        }
        catch (Exception ex)
        {
            lastReport = string.Join(Environment.NewLine, lines) + Environment.NewLine + $"Scan error: {ex.Message}";
            reportBox.Text = lastReport;
            copyButton.Enabled = true;
            status.Text = "Scan finished with a warning";
        }
        finally
        {
            scanButton.Enabled = true;
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
        reportBox.AppendText(Environment.NewLine + Environment.NewLine + "=== UPDATE NOW ===" + Environment.NewLine);
        reportBox.AppendText("Only scan-detected updates will be changed." + Environment.NewLine);

        var success = 0;
        var failed = 0;
        foreach (var packageId in detectedPackageIds.ToList())
        {
            status.Text = $"Updating {packageId}…";
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
        }

        status.Text = failed == 0 ? $"Done — {success} update(s) installed ✓" : $"Done — {success} updated, {failed} failed";
        lastReport = reportBox.Text;
        copyButton.Enabled = true;
        scanButton.Enabled = true;
        updateButton.Text = "SCAN AGAIN";
        updateButton.Enabled = true;
        updateButton.Click -= async (_, _) => await UpdateNowAsync();
        updateButton.Click += async (_, _) => await ScanAsync();
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
