import os, sys, subprocess, threading, tkinter as tk
from tkinter import ttk, messagebox

MARKER=b"\nAPPFORGE_KEYS_V1:"
END=b":END\n"

CATALOG={
'google-chrome':('Google Chrome','com.google.Chrome','google-chrome'),
'mozilla-firefox':('Mozilla Firefox','org.mozilla.firefox','firefox'),
'brave':('Brave','com.brave.Browser','brave-browser'),
'vivaldi':('Vivaldi','com.vivaldi.Vivaldi','vivaldi'),
'discord':('Discord','com.discordapp.Discord','discord'),
'telegram':('Telegram','org.telegram.desktop','telegram'),
'slack':('Slack','com.slack.Slack','slack'),
'zoom':('Zoom','us.zoom.Zoom','zoom'),
'steam':('Steam','com.valvesoftware.Steam','steam'),
'prism-launcher':('Prism Launcher','org.prismlauncher.PrismLauncher','prismlauncher'),
'heroic-games-launcher':('Heroic Games Launcher','com.heroicgameslauncher.hgl','heroic'),
'vlc-media-player':('VLC media player','org.videolan.VLC','vlc'),
'spotify':('Spotify','com.spotify.Client','spotify'),
'obs-studio':('OBS Studio','com.obsproject.Studio','obs'),
'audacity':('Audacity','org.audacityteam.Audacity','audacity'),
'handbrake':('HandBrake','fr.handbrake.ghb','handbrake-app'),
'visual-studio-code':('Visual Studio Code','com.visualstudio.code','visual-studio-code'),
'postman':('Postman','com.getpostman.Postman','postman'),
'blockbench':('Blockbench','net.blockbench.Blockbench','blockbench'),
'libreoffice':('LibreOffice','org.libreoffice.LibreOffice','libreoffice'),
'obsidian':('Obsidian','md.obsidian.Obsidian','obsidian'),
'thunderbird':('Thunderbird','org.mozilla.Thunderbird','thunderbird'),
'krita':('Krita','org.kde.krita','krita'),
'gimp':('GIMP','org.gimp.GIMP','gimp'),
'blender':('Blender','org.blender.Blender','blender'),
'inkscape':('Inkscape','org.inkscape.Inkscape','inkscape'),
'qbittorrent':('qBittorrent','org.qbittorrent.qBittorrent','qbittorrent'),
'filezilla':('FileZilla','org.filezillaproject.Filezilla','filezilla'),
'bitwarden':('Bitwarden','com.bitwarden.desktop','bitwarden'),
'keepassxc':('KeePassXC','org.keepassxc.KeePassXC','keepassxc'),
'rustdesk':('RustDesk','com.rustdesk.RustDesk','rustdesk'),
}

MAC_FORMULAS={
'git':'git','python-3':'python','node-js-lts':'node','7-zip':'sevenzip'
}
MAC_CASKS={
'github-desktop':'github','docker-desktop':'docker','pycharm-community':'pycharm-ce','intellij-idea-community':'intellij-idea-ce','balenaetcher':'balenaetcher','raycast':'raycast','rectangle':'rectangle','iterm2':'iterm2'
}

def selection_source():
    if sys.platform.startswith('linux') and os.environ.get('APPIMAGE'):
        return os.environ['APPIMAGE']
    return sys.executable

def read_selection():
    try:
        with open(selection_source(),'rb') as f: data=f.read()
        start=data.rfind(MARKER)
        if start<0: return []
        start+=len(MARKER); end=data.find(END,start)
        if end<0: return []
        return [x for x in data[start:end].decode('utf-8','ignore').split(',') if x]
    except Exception:
        return []

def supported(keys):
    out=[]
    for key in keys:
        if key in CATALOG:
            name,linux,mac=CATALOG[key]
            if sys.platform=='darwin' and mac: out.append((key,name,'cask',mac))
            elif sys.platform.startswith('linux') and linux: out.append((key,name,'flatpak',linux))
        elif sys.platform=='darwin' and key in MAC_FORMULAS:
            out.append((key,key.replace('-',' ').title(),'formula',MAC_FORMULAS[key]))
        elif sys.platform=='darwin' and key in MAC_CASKS:
            out.append((key,key.replace('-',' ').title(),'cask',MAC_CASKS[key]))
    return out

class AppForge(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title('AppForge')
        self.geometry('850x650')
        self.minsize(700,500)
        self.configure(bg='#07111e')
        self.keys=read_selection()
        self.apps=supported(self.keys)
        self.vars=[]
        self.build()

    def build(self):
        style=ttk.Style(self)
        try: style.theme_use('clam')
        except: pass
        style.configure('TButton',font=('Arial',11,'bold'),padding=10)
        style.configure('TProgressbar',thickness=14)
        top=tk.Frame(self,bg='#07111e'); top.pack(fill='x',padx=24,pady=(22,10))
        tk.Label(top,text='AppForge',fg='white',bg='#07111e',font=('Arial',28,'bold')).pack(anchor='w')
        subtitle=f'{len(self.apps)} selected apps ready to install' if self.apps else 'No website selection was found. Download AppForge again after choosing apps.'
        tk.Label(top,text=subtitle,fg='#8fa8c2',bg='#07111e',font=('Arial',11)).pack(anchor='w',pady=(4,0))
        body=tk.Frame(self,bg='#0c1a2b',highlightbackground='#1c3a56',highlightthickness=1); body.pack(fill='both',expand=True,padx=24,pady=10)
        canvas=tk.Canvas(body,bg='#0c1a2b',highlightthickness=0); scroll=ttk.Scrollbar(body,orient='vertical',command=canvas.yview)
        inner=tk.Frame(canvas,bg='#0c1a2b'); inner.bind('<Configure>',lambda e: canvas.configure(scrollregion=canvas.bbox('all')))
        canvas.create_window((0,0),window=inner,anchor='nw'); canvas.configure(yscrollcommand=scroll.set); canvas.pack(side='left',fill='both',expand=True); scroll.pack(side='right',fill='y')
        for key,name,kind,pkg in self.apps:
            var=tk.BooleanVar(value=True); self.vars.append((var,(key,name,kind,pkg)))
            row=tk.Frame(inner,bg='#102238'); row.pack(fill='x',padx=10,pady=5)
            tk.Checkbutton(row,variable=var,bg='#102238',activebackground='#102238',selectcolor='#102238').pack(side='left',padx=10,pady=10)
            tk.Label(row,text=name,fg='white',bg='#102238',font=('Arial',11,'bold')).pack(side='left',padx=(4,10))
            tk.Label(row,text='Flatpak' if kind=='flatpak' else 'Homebrew',fg='#7f9bb7',bg='#102238',font=('Arial',9)).pack(side='right',padx=12)
        bottom=tk.Frame(self,bg='#07111e'); bottom.pack(fill='x',padx=24,pady=(8,22))
        self.status=tk.Label(bottom,text='Ready',fg='#8fa8c2',bg='#07111e'); self.status.pack(anchor='w')
        self.progress=ttk.Progressbar(bottom,mode='determinate'); self.progress.pack(fill='x',pady=(6,10))
        self.install=ttk.Button(bottom,text='Install selected apps',command=self.start_install); self.install.pack(side='right')
        if not self.apps: self.install.state(['disabled'])

    def start_install(self):
        chosen=[a for v,a in self.vars if v.get()]
        if not chosen: messagebox.showinfo('AppForge','Choose at least one app.'); return
        self.install.state(['disabled']); self.progress['maximum']=len(chosen); self.progress['value']=0
        threading.Thread(target=self.install_all,args=(chosen,),daemon=True).start()

    def run_hidden(self,args):
        p=subprocess.run(args,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
        if p.returncode!=0: raise RuntimeError((p.stderr or p.stdout or 'Installation failed').strip()[-500:])

    def install_all(self,chosen):
        ok=0
        try:
            if sys.platform.startswith('linux'):
                if not shutil_which('flatpak'): raise RuntimeError('Flatpak is required on this Linux system.')
                self.run_hidden(['flatpak','remote-add','--if-not-exists','flathub','https://flathub.org/repo/flathub.flatpakrepo'])
            elif sys.platform=='darwin' and not shutil_which('brew'):
                raise RuntimeError('Homebrew is required on this Mac.')
            for i,(key,name,kind,pkg) in enumerate(chosen,1):
                self.after(0,lambda n=name:self.status.config(text=f'Installing {n}...'))
                try:
                    if kind=='flatpak': self.run_hidden(['flatpak','install','-y','flathub',pkg])
                    elif kind=='formula': self.run_hidden(['brew','install',pkg])
                    else: self.run_hidden(['brew','install','--cask',pkg])
                    ok+=1
                except Exception as e:
                    self.after(0,lambda n=name,err=str(e):messagebox.showwarning('AppForge',f'{n}: {err}'))
                self.after(0,lambda v=i:self.progress.configure(value=v))
            self.after(0,lambda:self.status.config(text=f'Finished — {ok}/{len(chosen)} completed.'))
        except Exception as e:
            self.after(0,lambda:messagebox.showerror('AppForge',str(e)))
            self.after(0,lambda:self.status.config(text='Could not start installation.'))
        finally:
            self.after(0,lambda:self.install.state(['!disabled']))

def shutil_which(name):
    import shutil
    return shutil.which(name)

if __name__=='__main__': AppForge().mainloop()
