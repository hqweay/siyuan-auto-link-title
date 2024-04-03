import { Plugin } from "siyuan";

import AutoLinkTitle from "./util";
import { CheckIf } from "./checkif";

export default class PluginSample extends Plugin {
  async onload() {
    this.eventBus.on("paste", async (event: any) => {
      if (!navigator.onLine) {
        return;
      }

      let clipboardText = event.detail.textPlain.trim();

      if (!CheckIf.isUrl(clipboardText) || CheckIf.isImage(clipboardText)) {
        return;
      }

      //阻止默认行为：如果是 URL 则不直接粘贴，而是尝试获取标题
      event.preventDefault();
      // 插入一个占位符
      document.execCommand("insertText", false, `[fetching...]`);
      //阻止冒泡
      //   event.stopPropagation();

      let title = await new AutoLinkTitle().convertUrlToTitledLink(
        clipboardText
      );

      //撤销占位符
      event.detail.protyle.undo.undo(event.detail.protyle);

      title = title ? title : clipboardText;
      document.execCommand("insertText", false, `[${title}](${clipboardText})`);
    });
  }
}
