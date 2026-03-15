import { node } from "../script/dom.js";

export function showMessages(messages) {
  const divs = messages.map(([title, desc]) => {
    const div = node({
      type: "div",
      style:
        "display:flex; flex-flow:column wrap; gap:7px; padding: 7px; background-color: #FEE685;",
    });
    const h4 = node({
      type: "h4",
      text: title,
      style: "text-align:center; font-weight:bold;",
    });

    const p = node({ type: "p", text: desc });

    div.appendChild(h4);
    div.appendChild(p);
    // info.appendChild(div);
    return div;
  });
  return divs;
}