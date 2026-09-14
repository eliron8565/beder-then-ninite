using System.Diagnostics;
using System.Drawing.Drawing2D;
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
    private static readonly Color Bg = Color.FromArgb(5, 10, 20);
    private static readonly Color Surface = Color.FromArgb(10, 20, 35);
    private static readonly Color Surface2 = Color.FromArgb(14, 28, 47);
    private static readonly Color Surface3 = Color.FromArgb(18, 36, 59);
    private static readonly Color Border = Color.FromArgb(38, 66, 94);
    private static readonly Color TextColor = Color.FromArgb(242, 247, 253);
    private static readonly Color Muted = Color.FromArgb(145, 165, 188);
    private static readonly Color Cyan = Color.FromArgb(89, 220, 255);
    private static readonly Color Purple = Color.FromArgb(153, 126, 255);
    private static readonly Color Green = Color.FromArgb(108, 232, 178);
    private static readonly Color Amber = Color.FromArgb(248, 199, 92);
    private static readonly Color Red = Color.FromArgb(255, 116, 129);

    private readonly Label status = new();
    private readonly Label healthScore = new();
    private readonly Label healthLabel = new();
    private readonly Label osValue = new();
    private readonly Label networkValue = new();
    private readonly Label diskValue = new();
    private readonly Label wingetValue = new();
    private readonly Label installedValue = new();
    private readonly Label updatesValue = new();
    private readonly Label lastScanValue = new();
    private readonly RichTextBox reportBox = new();
    private readonly ProgressBar scanProgress = new();
    private readonly Button scanButton = new();
    private readonly Button updateButton = new();
    private readonly Button copyButton = new();
    private readonly Button appForgeButton = new();
    private readonly FlowLayoutPanel updateChips = new();
    private readonly List<string> detectedPackageIds = new();
    private string lastReport = string.Empty;
    private bool wingetAvailable;
    private bool updateCompleted;

    public ScannerForm()
    {
        Text = "AppForge PC Scanner";
        StartPosition = FormStartPosition.CenterScreen;
        MinimumSize = new Size(980, 720);
        Size = new Size(1180, 860);
        BackColor = Bg;
        ForeColor = TextColor;
        Font = new Font("Segoe UI", 10f);
        DoubleBuffered = true;
        try { Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath); } catch { }

        BuildUi();
        Shown += async (_, _) => await ScanAsync();
    }

    private void BuildUi()
    {
        var root = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            Padding = new Padding(26),
            ColumnCount = 1,
            RowCount = 8,
            BackColor = Bg
        };
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.Percent, 100));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        Controls.Add(root);

        root.Controls.Add(BuildHero());
        root.Controls.Add(BuildStatusBar());

        var sectionHead = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 2, AutoSize = true, Margin = new Padding(2, 2, 2, 8) };
        sectionHead.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        sectionHead.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        sectionHead.Controls.Add(new Label { AutoSize = true, Text = "SYSTEM OVERVIEW", ForeColor = Muted, Font = new Font("Segoe UI", 8.5f, FontStyle.Bold) }, 0, 0);
        lastScanValue.AutoSize = true;
        lastScanValue.Text = "Not scanned yet";
        lastScanValue.ForeColor = Muted;
        lastScanValue.Font = new Font("Segoe UI", 8.5f);
        sectionHead.Controls.Add(lastScanValue, 1, 0);
        root.Controls.Add(sectionHead);

        root.Controls.Add(BuildCards());

        scanProgress.Dock = DockStyle.Fill;
        scanProgress.Height = 7;
        scanProgress.Style = ProgressBarStyle.Marquee;
        scanProgress.MarqueeAnimationSpeed = 28;
        scanProgress.Margin = new Padding(2, 4, 2, 12);
        root.Controls.Add(scanProgress);

        root.Controls.Add(BuildDetailsArea());
        root.Controls.Add(BuildSafeRule());
        root.Controls.Add(BuildActions());
    }

    private Control BuildHero()
    {
        var hero = new RoundedPanel
        {
            Dock = DockStyle.Fill,
            Height = 118,
            BackColor = Surface2,
            BorderColor = Border,
            Radius = 18,
            Margin = new Padding(0, 0, 0, 14)
        };

        var glow = new Panel { Width = 5, Height = 72, BackColor = Cyan, Location = new Point(18, 23) };
        hero.Controls.Add(glow);

        var brand = new Label
        {
            AutoSize = true,
            Text = "APPFORGE",
            Location = new Point(40, 18),
            Font = new Font("Segoe UI", 9.5f, FontStyle.Bold),
            ForeColor = Cyan
        };
        hero.Controls.Add(brand);

        var title = new Label
        {
            AutoSize = true,
            Text = "PC Scanner",
            Location = new Point(38, 38),
            Font = new Font("Segoe UI", 28f, FontStyle.Bold),
            ForeColor = TextColor
        };
        hero.Controls.Add(title);

        var subtitle = new Label
        {
            AutoSize = true,
            Text = "Scan first. Update only what was found. Nothing unrelated gets touched.",
            Location = new Point(41, 82),
            Font = new Font("Segoe UI", 9.5f),
            ForeColor = Muted
        };
        hero.Controls.Add(subtitle);

        var health = new RoundedPanel
        {
            Width = 180,
            Height = 78,
            BackColor = Surface3,
            BorderColor = Border,
            Radius = 16,
            Anchor = AnchorStyles.Top | AnchorStyles.Right,
            Location = new Point(910, 20)
        };
        healthLabel.Text = "PC HEALTH";
        healthLabel.AutoSize = true;
        healthLabel.Location = new Point(16, 12);
        healthLabel.ForeColor = Muted;
        healthLabel.Font = new Font("Segoe UI", 8.5f, FontStyle.Bold);
        health.Controls.Add(healthLabel);

        healthScore.Text = "READY";
        healthScore.AutoSize = true;
        healthScore.Location = new Point(15, 34);
        healthScore.ForeColor = Cyan;
        healthScore.Font = new Font("Segoe UI", 20f, FontStyle.Bold);
        health.Controls.Add(healthScore);
        hero.Controls.Add(health);
        hero.Resize += (_, _) => health.Left = hero.ClientSize.Width - health.Width - 20;

        return hero;
    }

    private Control BuildStatusBar()
    {
        var panel = new RoundedPanel
        {
            Dock = DockStyle.Fill,
            Height = 48,
            BackColor = Surface,
            BorderColor = Border,
            Radius = 14,
            Margin = new Padding(0, 0, 0, 14)
        };
        status.AutoSize = true;
        status.Text = "● Ready to scan";
        status.ForeColor = Cyan;
        status.Font = new Font("Segoe UI", 10f, FontStyle.Bold);
        status.Location = new Point(16, 14);
        panel.Controls.Add(status);

        var badge = new Label
        {
            AutoSize = true,
            Text = "  SAFE MODE  ",
            BackColor = Color.FromArgb(20, 60, 55),
            ForeColor = Green,
            Font = new Font("Segoe UI", 8f, FontStyle.Bold),
            Padding = new Padding(8, 4, 8, 4),
            Anchor = AnchorStyles.Top | AnchorStyles.Right,
            Location = new Point(940, 10)
        };
        panel.Controls.Add(badge);
        panel.Resize += (_, _) => badge.Left = panel.ClientSize.Width - badge.Width - 14;
        return panel;
    }

    private Control BuildCards()
    {
        var cards = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            ColumnCount = 3,
            RowCount = 2,
            AutoSize = true,
            Margin = new Padding(0, 0, 0, 10)
        };
        for (var i = 0; i < 3; i++) cards.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33.333f));
        cards.RowStyles.Add(new RowStyle(SizeType.Absolute, 108));
        cards.RowStyles.Add(new RowStyle(SizeType.Absolute, 108));

        cards.Controls.Add(MetricCard("WINDOWS", "▣", osValue, Cyan), 0, 0);
        cards.Controls.Add(MetricCard("INTERNET", "◉", networkValue, Green), 1, 0);
        cards.Controls.Add(MetricCard("SYSTEM DRIVE", "◆", diskValue, Purple), 2, 0);
        cards.Controls.Add(MetricCard("WINGET", "⌁", wingetValue, Cyan), 0, 1);
        cards.Controls.Add(MetricCard("INSTALLED APPS", "▦", installedValue, Purple), 1, 1);
        cards.Controls.Add(MetricCard("UPDATES FOUND", "↻", updatesValue, Amber), 2, 1);
        return cards;
    }

    private static Control MetricCard(string title, string glyph, Label value, Color accent)
    {
        var card = new RoundedPanel
        {
            Dock = DockStyle.Fill,
            Margin = new Padding(5),
            BackColor = Surface2,
            BorderColor = Border,
            Radius = 15
        };

        var accentLine = new Panel { Width = 4, Height = 52, Location = new Point(14, 25), BackColor = accent };
        card.Controls.Add(accentLine);
        card.Controls.Add(new Label
        {
            Text = glyph,
            AutoSize = true,
            Location = new Point(32, 19),
            ForeColor = accent,
            Font = new Font("Segoe UI Symbol", 14f, FontStyle.Bold)
        });
        card.Controls.Add(new Label
        {
            Text = title,
            AutoSize = true,
            Location = new Point(62, 22),
            ForeColor = Muted,
            Font = new Font("Segoe UI", 8f, FontStyle.Bold)
        });

        value.Text = "—";
        value.AutoSize = true;
        value.Location = new Point(32, 54);
        value.ForeColor = TextColor;
        value.Font = new Font("Segoe UI", 16f, FontStyle.Bold);
        card.Controls.Add(value);
        return card;
    }

    private Control BuildDetailsArea()
    {
        var split = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            ColumnCount = 2,
            RowCount = 1,
            Margin = new Padding(0, 0, 0, 12)
        };
        split.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 64));
        split.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 36));

        var reportShell = new RoundedPanel { Dock = DockStyle.Fill, BackColor = Surface, BorderColor = Border, Radius = 16, Margin = new Padding(5, 0, 5, 0), Padding = new Padding(14) };
        var reportTitle = new Label { Dock = DockStyle.Top, Height = 28, Text = "SCAN REPORT", ForeColor = Muted, Font = new Font("Segoe UI", 8.5f, FontStyle.Bold) };
        reportBox.Dock = DockStyle.Fill;
        reportBox.ReadOnly = true;
        reportBox.BorderStyle = BorderStyle.None;
        reportBox.BackColor = Surface;
        reportBox.ForeColor = Color.FromArgb(207, 223, 241);
        reportBox.Font = new Font("Cascadia Mono", 9.2f);
        reportBox.Text = "Run a scan to see system details.";
        reportShell.Controls.Add(reportBox);
        reportShell.Controls.Add(reportTitle);
        split.Controls.Add(reportShell, 0, 0);

        var updatesShell = new RoundedPanel { Dock = DockStyle.Fill, BackColor = Surface, BorderColor = Border, Radius = 16, Margin = new Padding(5, 0, 5, 0), Padding = new Padding(14) };
        var updatesTitle = new Label { Dock = DockStyle.Top, Height = 28, Text = "UPDATE QUEUE", ForeColor = Muted, Font = new Font("Segoe UI", 8.5f, FontStyle.Bold) };
        updateChips.Dock = DockStyle.Fill;
        updateChips.AutoScroll = true;
        updateChips.FlowDirection = FlowDirection.TopDown;
        updateChips.WrapContents = false;
        updateChips.BackColor = Surface;
        updateChips.Controls.Add(EmptyQueueLabel("No updates detected yet."));
        updatesShell.Controls.Add(updateChips);
        updatesShell.Controls.Add(updatesTitle);
        split.Controls.Add(updatesShell, 1, 0);

        return split;
    }

    private static Label EmptyQueueLabel(string text) => new()
    {
        AutoSize = false,
        Width = 300,
        Height = 70,
        Text = text,
        TextAlign = ContentAlignment.MiddleCenter,
        ForeColor = Muted,
        Font = new Font("Segoe UI", 9f)
    };

    private Control BuildSafeRule()
    {
        var rule = new RoundedPanel
        {
            Dock = DockStyle.Fill,
            Height = 52,
            BackColor = Color.FromArgb(11, 33, 36),
            BorderColor = Color.FromArgb(31, 89, 82),
            Radius = 14,
            Margin = new Padding(0, 0, 0, 12)
        };
        rule.Controls.Add(new Label
        {
            AutoSize = true,
            Text = "✓  SAFE UPDATE RULE",
            Location = new Point(16, 9),
            ForeColor = Green,
            Font = new Font("Segoe UI", 8.5f, FontStyle.Bold)
        });
        rule.Controls.Add(new Label
        {
            AutoSize = true,
            Text = "UPDATE NOW only touches package IDs detected by the latest scan.",
            Location = new Point(16, 27),
            ForeColor = Color.FromArgb(177, 205, 199),
            Font = new Font("Segoe UI", 8.8f)
        });
        return rule;
    }

    private Control BuildActions()
    {
        var actions = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 5, AutoSize = true };
        actions.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        for (var i = 1; i < 5; i++) actions.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));

        appForgeButton.Text = "OPEN APPFORGE";
        StyleSecondary(appForgeButton);
        appForgeButton.Click += (_, _) => Process.Start(new ProcessStartInfo("https://eliron8565.github.io/beder-then-ninite/") { UseShellExecute = true });

        copyButton.Text = "COPY REPORT";
        StyleSecondary(copyButton);
        copyButton.Enabled = false;
        copyButton.Click += (_, _) =>
        {
            if (!string.IsNullOrWhiteSpace(lastReport))
            {
                try { Clipboard.SetText(lastReport); status.Text = "● Report copied ✓"; }
                catch { status.Text = "● Could not copy report"; }
            }
        };

        scanButton.Text = "↻  SCAN AGAIN";
        StyleSecondary(scanButton);
        scanButton.Click += async (_, _) => await ScanAsync();

        updateButton.Text = "UPDATE NOW";
        StylePrimary(updateButton);
        updateButton.Enabled = false;
        updateButton.Click += async (_, _) =>
        {
            if (updateCompleted) await ScanAsync();
            else await UpdateNowAsync();
        };

        actions.Controls.Add(new Panel { Dock = DockStyle.Fill }, 0, 0);
        actions.Controls.Add(appForgeButton, 1, 0);
        actions.Controls.Add(copyButton, 2, 0);
        actions.Controls.Add(scanButton, 3, 0);
        actions.Controls.Add(updateButton, 4, 0);
        return actions;
    }

    private static void StylePrimary(Button button)
    {
        button.AutoSize = true;
        button.Padding = new Padding(25, 12, 25, 12);
        button.FlatStyle = FlatStyle.Flat;
        button.FlatAppearance.BorderSize = 0;
        button.BackColor = Green;
        button.ForeColor = Color.FromArgb(5, 24, 20);
        button.Font = new Font("Segoe UI", 9.5f, FontStyle.Bold);
        button.Margin = new Padding(8, 0, 0, 0);
        button.Cursor = Cursors.Hand;
    }

    private static void StyleSecondary(Button button)
    {
        button.AutoSize = true;
        button.Padding = new Padding(16, 11, 16, 11);
        button.FlatStyle = FlatStyle.Flat;
        button.FlatAppearance.BorderColor = Border;
        button.FlatAppearance.BorderSize = 1;
        button.BackColor = Surface;
        button.ForeColor = TextColor;
        button.Font = new Font("Segoe UI", 9f, FontStyle.Bold);
        button.Margin = new Padding(8, 0, 0, 0);
        button.Cursor = Cursors.Hand;
    }

    private async Task ScanAsync()
    {
        updateCompleted = false;
        scanButton.Enabled = false;
        updateButton.Enabled = false;
        copyButton.Enabled = false;
        detectedPackageIds.Clear();
        wingetAvailable = false;
        status.Text = "● Scanning your PC…";
        status.ForeColor = Cyan;
        healthScore.Text = "SCANNING";
        healthScore.ForeColor = Cyan;
        reportBox.Text = "Scanning system…";
        SetQueueMessage("Looking for updates…");
        scanProgress.Style = ProgressBarStyle.Marquee;
        scanProgress.MarqueeAnimationSpeed = 28;

        var lines = new List<string>();
        var updateNames = new List<string>();

        try
        {
            var os = Environment.OSVersion.VersionString;
            osValue.Text = Environment.OSVersion.Version.Build >= 22000 ? "Windows 11" : "Windows";
            osValue.ForeColor = TextColor;
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
            wingetValue.Text = wingetAvailable ? wingetVersion.Output.Trim() : "Unavailable";
            wingetValue.ForeColor = wingetAvailable ? Green : Red;
            lines.Add($"Winget: {(wingetAvailable ? wingetVersion.Output.Trim() : "not available")}");

            var installedCount = 0;
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
                        {
                            foreach (var source in sources.EnumerateArray())
                            {
                                if (source.TryGetProperty("Packages", out var packages)) installedCount += packages.GetArrayLength();
                            }
                        }
                    }
                    catch { }
                    try { File.Delete(temp); } catch { }
                }

                status.Text = "● Checking for updates…";
                var upgrades = await RunCaptureAsync("winget", "upgrade --accept-source-agreements --disable-interactivity", 90000);
                ParseWingetUpgradeTable(upgrades.Output, updateNames, detectedPackageIds);
            }

            installedValue.Text = installedCount > 0 ? installedCount.ToString() : (wingetAvailable ? "Detected" : "—");
            installedValue.ForeColor = TextColor;
            updatesValue.Text = detectedPackageIds.Count.ToString();
            updatesValue.ForeColor = detectedPackageIds.Count == 0 ? Green : Amber;
            lines.Add($"Installed packages detected: {installedCount}");
            lines.Add($"Updates detected: {detectedPackageIds.Count}");

            if (updateNames.Count > 0)
            {
                lines.Add("");
                lines.Add("UPDATE CANDIDATES:");
                for (var i = 0; i < Math.Min(updateNames.Count, detectedPackageIds.Count); i++)
                    lines.Add($"• {updateNames[i]}  [{detectedPackageIds[i]}]");
            }

            lines.Add("");
            lines.Add("SAFE UPDATE RULE:");
            lines.Add("Only package IDs detected by this scan can be updated.");
            lines.Add("Unrelated apps and drivers are left untouched.");

            lastReport = string.Join(Environment.NewLine, lines);
            reportBox.Text = lastReport;
            copyButton.Enabled = true;
            PopulateUpdateQueue(updateNames, detectedPackageIds);

            var score = 100;
            if (!online) score -= 20;
            if (!wingetAvailable) score -= 20;
            if (freeGb < 10) score -= 15;
            score -= Math.Min(30, detectedPackageIds.Count * 3);
            score = Math.Max(0, score);

            healthScore.Text = $"{score}/100";
            healthScore.ForeColor = score >= 90 ? Green : score >= 70 ? Amber : Red;
            updateButton.Enabled = wingetAvailable && online && detectedPackageIds.Count > 0;
            updateButton.Text = detectedPackageIds.Count > 0 ? $"UPDATE NOW  •  {detectedPackageIds.Count}" : "NO UPDATES";
            status.Text = detectedPackageIds.Count > 0
                ? $"● Scan complete — {detectedPackageIds.Count} update(s) found"
                : "● Scan complete — system looks good ✓";
            status.ForeColor = detectedPackageIds.Count > 0 ? Amber : Green;
            lastScanValue.Text = $"Last scan: {DateTime.Now:HH:mm}";
        }
        catch (Exception ex)
        {
            lastReport = string.Join(Environment.NewLine, lines) + Environment.NewLine + $"Scan error: {ex.Message}";
            reportBox.Text = lastReport;
            copyButton.Enabled = true;
            status.Text = "● Scan finished with a warning";
            status.ForeColor = Amber;
            healthScore.Text = "CHECK";
            healthScore.ForeColor = Amber;
            SetQueueMessage("Scan could not complete update detection.");
        }
        finally
        {
            scanProgress.Style = ProgressBarStyle.Continuous;
            scanProgress.MarqueeAnimationSpeed = 0;
            scanProgress.Value = 100;
            scanButton.Enabled = true;
        }
    }

    private async Task UpdateNowAsync()
    {
        if (!wingetAvailable || detectedPackageIds.Count == 0) return;

        var targets = detectedPackageIds.Distinct(StringComparer.OrdinalIgnoreCase).ToList();
        scanButton.Enabled = false;
        updateButton.Enabled = false;
        copyButton.Enabled = false;
        updateButton.Text = "UPDATING…";
        status.ForeColor = Cyan;
        scanProgress.Style = ProgressBarStyle.Continuous;
        scanProgress.Minimum = 0;
        scanProgress.Maximum = Math.Max(1, targets.Count);
        scanProgress.Value = 0;

        var succeeded = 0;
        var failed = 0;
        var updateLog = new List<string>();

        for (var i = 0; i < targets.Count; i++)
        {
            var id = targets[i];
            status.Text = $"● Updating {i + 1}/{targets.Count}: {id}";
            MarkQueueItem(id, "Updating…", Cyan);

            var result = await RunCaptureAsync(
                "winget",
                $"upgrade --id \"{id}\" -e --silent --accept-package-agreements --accept-source-agreements --disable-interactivity",
                180000);

            if (result.ExitCode == 0)
            {
                succeeded++;
                MarkQueueItem(id, "Updated ✓", Green);
                updateLog.Add($"✓ {id}");
            }
            else
            {
                failed++;
                MarkQueueItem(id, "Failed", Red);
                updateLog.Add($"✕ {id}: {ShortError(result.Output)}");
            }

            scanProgress.Value = Math.Min(scanProgress.Maximum, i + 1);
        }

        updateCompleted = true;
        updateButton.Enabled = true;
        updateButton.Text = "SCAN AGAIN";
        scanButton.Enabled = true;
        copyButton.Enabled = true;
        status.Text = failed == 0
            ? $"● Update complete — {succeeded} updated ✓"
            : $"● Update complete — {succeeded} updated, {failed} failed";
        status.ForeColor = failed == 0 ? Green : Amber;

        var updateSummary = new StringBuilder(lastReport);
        updateSummary.AppendLine().AppendLine().AppendLine("UPDATE RESULT:");
        foreach (var line in updateLog) updateSummary.AppendLine(line);
        lastReport = updateSummary.ToString();
        reportBox.Text = lastReport;
    }

    private void PopulateUpdateQueue(List<string> names, List<string> ids)
    {
        updateChips.Controls.Clear();
        if (ids.Count == 0)
        {
            updateChips.Controls.Add(EmptyQueueLabel("✓ No updates found.\nYour detected apps are current."));
            return;
        }

        for (var i = 0; i < ids.Count; i++)
        {
            var name = i < names.Count ? names[i] : ids[i];
            var id = ids[i];
            var row = new RoundedPanel
            {
                Width = 315,
                Height = 62,
                Margin = new Padding(0, 0, 0, 7),
                BackColor = Surface2,
                BorderColor = Border,
                Radius = 12,
                Tag = id
            };
            row.Controls.Add(new Label { AutoSize = true, Text = name, Location = new Point(12, 10), ForeColor = TextColor, Font = new Font("Segoe UI", 9f, FontStyle.Bold), MaximumSize = new Size(205, 0) });
            row.Controls.Add(new Label { AutoSize = true, Text = id, Location = new Point(12, 34), ForeColor = Muted, Font = new Font("Segoe UI", 7.8f), MaximumSize = new Size(210, 0) });
            row.Controls.Add(new Label { Name = "queueStatus", AutoSize = false, Width = 82, Height = 28, Text = "Ready", TextAlign = ContentAlignment.MiddleRight, Location = new Point(220, 17), ForeColor = Amber, Font = new Font("Segoe UI", 8.2f, FontStyle.Bold) });
            updateChips.Controls.Add(row);
        }
    }

    private void SetQueueMessage(string text)
    {
        updateChips.Controls.Clear();
        updateChips.Controls.Add(EmptyQueueLabel(text));
    }

    private void MarkQueueItem(string packageId, string text, Color color)
    {
        foreach (Control control in updateChips.Controls)
        {
            if (control.Tag is string id && id.Equals(packageId, StringComparison.OrdinalIgnoreCase))
            {
                var label = control.Controls.Find("queueStatus", false).FirstOrDefault() as Label;
                if (label != null)
                {
                    label.Text = text;
                    label.ForeColor = color;
                }
                break;
            }
        }
    }

    private static void ParseWingetUpgradeTable(string output, List<string> names, List<string> ids)
    {
        names.Clear();
        ids.Clear();
        if (string.IsNullOrWhiteSpace(output)) return;

        var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var raw in output.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries))
        {
            var line = raw.Trim();
            if (line.Length < 3 || line.StartsWith("-") || line.StartsWith("Name", StringComparison.OrdinalIgnoreCase)) continue;
            if (line.Contains("upgrade available", StringComparison.OrdinalIgnoreCase) ||
                line.Contains("No applicable upgrade", StringComparison.OrdinalIgnoreCase) ||
                line.Contains("upgrades available", StringComparison.OrdinalIgnoreCase)) continue;

            var parts = Regex.Split(line, @"\s{2,}").Where(p => !string.IsNullOrWhiteSpace(p)).ToArray();
            if (parts.Length < 4) continue;

            var id = parts[1].Trim();
            if (id.Length < 2 || id.Contains(' ')) continue;
            if (!seen.Add(id)) continue;

            names.Add(parts[0].Trim());
            ids.Add(id);
        }
    }

    private static string ShortError(string output)
    {
        if (string.IsNullOrWhiteSpace(output)) return "Unknown error";
        var line = output.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries)
            .Select(x => x.Trim())
            .LastOrDefault(x => !string.IsNullOrWhiteSpace(x));
        if (string.IsNullOrWhiteSpace(line)) return "Unknown error";
        return line.Length > 120 ? line[..120] + "…" : line;
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
            var stdoutTask = process.StandardOutput.ReadToEndAsync(cts.Token);
            var stderrTask = process.StandardError.ReadToEndAsync(cts.Token);
            await process.WaitForExitAsync(cts.Token);
            var stdout = await stdoutTask;
            var stderr = await stderrTask;
            return (process.ExitCode, stdout + Environment.NewLine + stderr);
        }
        catch (OperationCanceledException)
        {
            return (-2, "Operation timed out.");
        }
        catch (Exception ex)
        {
            return (-1, ex.Message);
        }
    }
}

internal sealed class RoundedPanel : Panel
{
    public int Radius { get; set; } = 14;
    public Color BorderColor { get; set; } = Color.Transparent;

    public RoundedPanel()
    {
        DoubleBuffered = true;
        Resize += (_, _) => UpdateRegion();
    }

    protected override void OnHandleCreated(EventArgs e)
    {
        base.OnHandleCreated(e);
        UpdateRegion();
    }

    protected override void OnPaint(PaintEventArgs e)
    {
        base.OnPaint(e);
        if (Width <= 1 || Height <= 1) return;
        e.Graphics.SmoothingMode = SmoothingMode.AntiAlias;
        using var path = RoundedRect(new Rectangle(0, 0, Width - 1, Height - 1), Radius);
        using var pen = new Pen(BorderColor, 1f);
        e.Graphics.DrawPath(pen, path);
    }

    private void UpdateRegion()
    {
        if (Width <= 1 || Height <= 1) return;
        using var path = RoundedRect(new Rectangle(0, 0, Width, Height), Radius);
        Region = new Region(path);
    }

    private static GraphicsPath RoundedRect(Rectangle rect, int radius)
    {
        var path = new GraphicsPath();
        var d = Math.Max(2, radius * 2);
        path.AddArc(rect.X, rect.Y, d, d, 180, 90);
        path.AddArc(rect.Right - d, rect.Y, d, d, 270, 90);
        path.AddArc(rect.Right - d, rect.Bottom - d, d, d, 0, 90);
        path.AddArc(rect.X, rect.Bottom - d, d, d, 90, 90);
        path.CloseFigure();
        return path;
    }
}
