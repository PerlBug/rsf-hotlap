import axios from "axios";

export async function getPageHtml(pageUrl) {
  const url = "https://corsproxy.io/?" + encodeURIComponent(pageUrl);
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const decoder = new TextDecoder("iso-8859-2");
  const html = decoder.decode(new Uint8Array(response.data));
  return html;
}
