import type { DiscordWidgetData } from "./lib/discord";

export class DiscordWidget {
  private readonly uri: string;

  constructor(uri: string) {
    this.uri = uri;
  }

  private getData() {
    return new Promise<DiscordWidgetData>((resolve) => {
      fetch(this.uri).then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            resolve(data);
          });
        } else {
          resolve({
            code: response.status,
            message: response.statusText,
          });
        }
      });
    });
  }

  public async generateHTML() {
    const data = await this.getData();

    const widget: HTMLElement = document.createElement("div");
    widget.classList.add("discordOnlineList");

    this.message(data, widget);
    this.code(data, widget);
    this.instantInvite(data, widget);
    this.members(data, widget);

    return widget;
  }

  private message(data: DiscordWidgetData, widget: HTMLElement) {
    if (data.message) {
      const p = document.createElement("p");
      p.innerText = data.message;
      widget.appendChild(p);
    }
  }

  private code(data: DiscordWidgetData, widget: HTMLElement) {
    if (data.code) {
      const p = document.createElement("p");
      p.innerText = data.code.toString();
      widget.appendChild(p);
    }
  }

  private instantInvite(data: DiscordWidgetData, widget: HTMLElement) {
    if (data.instant_invite) {
      const a = document.createElement("a");
      a.href = data.instant_invite;
      a.target = "_blank";
      a.innerText = "Beitreten";
      if (data.name) {
        a.title = data.name;
      }
      widget.appendChild(a);
    }
  }

  private members(data: DiscordWidgetData, widget: HTMLElement) {
    if (data.members) {
      {
        const txt = document.createElement("p");
        txt.innerText = `Aktuell ${data.members.length} Mitglieder online: `;

        widget.appendChild(txt);
      }

      const moreDiv = document.createElement("div");
      moreDiv.classList.add("member");
      for (const member of data.members) {
        const div = document.createElement("div");
        div.classList.add("member");
        const img = document.createElement("img");
        img.classList.add(member.status);
        img.src = member.avatar_url;
        const name = document.createElement("span");
        name.innerText = member.username;
        div.appendChild(img);
        div.appendChild(name);

        widget.appendChild(div);
      }
    }
  }
}