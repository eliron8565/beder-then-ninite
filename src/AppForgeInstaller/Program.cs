using System.Diagnostics;
using System.Drawing.Drawing2D;

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

    private static readonly AppItem[] Catalog =
    {
        new(0,"Google Chrome","Google.Chrome"), new(1,"Mozilla Firefox","Mozilla.Firefox"), new(2,"Brave","Brave.Brave"),
        new(3,"Discord","Discord.Discord"), new(4,"Telegram","Telegram.TelegramDesktop"), new(5,"Slack","SlackTechnologies.Slack"),
        new(6,"Steam","Valve.Steam"), new(7,"Prism Launcher","PrismLauncher.PrismLauncher"), new(8,"Heroic Games Launcher","HeroicGamesLauncher.HeroicGamesLauncher"),
        new(9,"7-Zip","7zip.7zip"), new(10,"VLC","VideoLAN.VLC"), new(11,"Spotify","Spotify.Spotify"),
        new(12,"OBS Studio","OBSProject.OBSStudio"), new(13,"Audacity","Audacity.Audacity"), new(14,"Krita","KDE.Krita"),
        new(15,"GIMP","GIMP.GIMP.3"), new(16,"Blender","BlenderFoundation.Blender"), new(17,"Visual Studio Code","Microsoft.VisualStudioCode"),
        new(18,"Git","Git.Git"), new(19,"Python 3","Python.Python.3.13"), new(20,"Node.js LTS","OpenJS.NodeJS.LTS"),
        new(21,"Docker Desktop","Docker.DockerDesktop"), new(22,"Postman","Postman.Postman"), new(23,"LibreOffice","TheDocumentFoundation.LibreOffice"),
        new(24,"Obsidian","Obsidian.Obsidian"), new(25,"Thunderbird","Mozilla.Thunderbird"), new(26,"qBittorrent","qBittorrent.qBittorrent"),
        new(27,"Tailscale","Tailscale.Tailscale"), new(28,"Bitwarden","Bitwarden.Bitwarden"), new(29,"KeePassXC","KeePassXCTeam.KeePassXC"),
        new(30,"RustDesk","RustDesk.RustDesk"),
        new(31,"Cisco Packet Tracer","url:https://www.netacad.com/learning-collections/cisco-packet-tracer"),
        new(32,"PyCharm Community","JetBrains.PyCharm.Community"), new(33,"IntelliJ IDEA Community","JetBrains.IntelliJIDEA.Community"),
        new(34,"Blockbench","JannisX11.Blockbench"), new(35,"balenaEtcher","Balena.Etcher"), new(36,"Rufus","Rufus.Rufus"),
        new(37,"PeaZip","Giorgiotani.Peazip"), new(38,"WizTree","AntibodySoftware.WizTree"), new(39,"WinRAR","RARLab.WinRAR"),
        new(40,"MiniTool Partition Wizard","MiniTool.PartitionWizard.Free")
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
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.Percent, 100));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        Controls.Add(root);

        var title = new Label { AutoSize = true, Text = "AppForge", Font = new Font("Segoe UI", 28, FontStyle.Bold), ForeColor = Color.White, Margin = new Padding(0,0,0,4) };
        var subtitle = new Label { AutoSize = true, Text = selectedApps.Count > 0 ? $"Ready to install {selectedApps.Count} selected apps" : "No website selection found. Choose apps below.", ForeColor = Color.FromArgb(150,165,187), Margin = new Padding(0,0,0,18) };
        root.Controls.Add(title); root.Controls.Add(subtitle);

        appList.Dock = DockStyle.Fill;
        appList.FlowDirection = FlowDirection.TopDown;
        appList.WrapContents = false;
        appList.AutoScroll = true;
        appList.BackColor = Color.FromArgb(11,21,37);
        appList.Padding = new Padding(12);
        root.Controls.Add(appList);

        foreach (var app in (selectedApps.Count > 0 ? selectedApps : Catalog.ToList())) AddAppRow(app, selectedApps.Count > 0);

        progress.Dock = DockStyle.Top; progress.Height = 16; progress.Style = ProgressBarStyle.Continuous; progress.Margin = new Padding(0,18,0,10);
        root.Controls.Add(progress);

        var bottom = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 2, AutoSize = true };
        bottom.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100)); bottom.ColumnStyles.Add(new ColumnStyle(SizeType.AutoSize));
        status.Text = "Ready"; status.AutoSize = true; status.Anchor = AnchorStyles.Left; status.ForeColor = Color.FromArgb(150,165,187);
        installButton.Text = "Install selected apps"; installButton.AutoSize = true; installButton.Padding = new Padding(18,10,18,10); installButton.FlatStyle = FlatStyle.Flat;
        installButton.FlatAppearance.BorderSize = 0; installButton.BackColor = Color.FromArgb(104,224,255); installButton.ForeColor = Color.FromArgb(6,17,31); installButton.Font = new Font("Segoe UI", 10f, FontStyle.Bold);
        installButton.Click += async (_,__) => await InstallAsync();
        bottom.Controls.Add(status,0,0); bottom.Controls.Add(installButton,1,0); root.Controls.Add(bottom);
    }

    private void AddAppRow(AppItem app, bool lockedSelection)
    {
        var panel = new Panel { Width = 820, Height = 58, Margin = new Padding(0,0,0,8), BackColor = Color.FromArgb(17,31,52) };
        var check = new CheckBox { Checked = lockedSelection || selectedApps.Contains(app), Enabled = !lockedSelection, AutoSize = true, Location = new Point(16,19), Tag = app };
        var name = new Label { Text = app.Name, AutoSize = true, Location = new Point(48,10), Font = new Font("Segoe UI",10f,FontStyle.Bold), ForeColor = Color.White };
        var packageText = app.PackageId.StartsWith("url:", StringComparison.OrdinalIgnoreCase) ? "Official download / sign-in required" : app.PackageId;
        var id = new Label { Text = packageText, AutoSize = true, Location = new Point(48,31), Font = new Font("Segoe UI",8.5f), ForeColor = Color.FromArgb(145,160,181) };
        panel.Controls.Add(check); panel.Controls.Add(name); panel.Controls.Add(id); appList.Controls.Add(panel);
    }

    private List<AppItem> CurrentSelection()
    {
        var list = new List<AppItem>();
        foreach (Control p in appList.Controls)
            foreach (Control c in p.Controls)
                if (c is CheckBox cb && cb.Checked && cb.Tag is AppItem a) list.Add(a);
        return list;
    }

    private async Task InstallAsync()
    {
        var apps = CurrentSelection();
        if (apps.Count == 0) { MessageBox.Show("Select at least one app.", "AppForge", MessageBoxButtons.OK, MessageBoxIcon.Information); return; }
        installButton.Enabled = false; progress.Maximum = apps.Count; progress.Value = 0;
        int ok = 0;
        foreach (var app in apps)
        {
            status.Text = $"Installing {app.Name}...";
            try
            {
                if (app.PackageId.StartsWith("url:", StringComparison.OrdinalIgnoreCase))
                {
                    var url = app.PackageId[4..];
                    Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
                    MessageBox.Show($"{app.Name} is distributed through its official account/download page. AppForge opened that page for you.", "Manual download required", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
                else
                {
                    var psi = new ProcessStartInfo("winget", $"install --id \"{app.PackageId}\" -e --silent --accept-package-agreements --accept-source-agreements")
                    { UseShellExecute = false, CreateNoWindow = true, RedirectStandardOutput = true, RedirectStandardError = true };
                    using var p = Process.Start(psi); if (p == null) throw new Exception("Could not start Winget.");
                    await p.WaitForExitAsync(); if (p.ExitCode == 0) ok++;
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"{app.Name}: {ex.Message}", "Installation error", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
            progress.Value++;
        }
        status.Text = $"Finished — {ok}/{apps.Count} installed automatically.";
        installButton.Enabled = true; installButton.Text = "Run again";
    }

    private static List<AppItem> ReadSelectionFromFilename()
    {
        var file = Path.GetFileNameWithoutExtension(Application.ExecutablePath);
        var marker = file.IndexOf("--", StringComparison.Ordinal);
        if (marker < 0) return new();
        var code = file[(marker + 2)..];
        var ids = code.Split('.', StringSplitOptions.RemoveEmptyEntries).Select(x => int.TryParse(x, out var n) ? n : -1).Where(x => x >= 0).ToHashSet();
        return Catalog.Where(a => ids.Contains(a.Index)).ToList();
    }

    private sealed record AppItem(int Index, string Name, string PackageId);
}