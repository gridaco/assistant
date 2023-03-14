import visit from "unist-util-visit";

export const remarkQuotationPlugin = () => {
  return (tree) => {
    visit(tree, "paragraph", (node: any) => {
      if (node.__set_by_remark_quotation_plugin) return;
      visit(node, "text", (node: any) => {
        if (node.__set_by_remark_quotation_plugin) return;

        const pattern = /"([^"]*)"/g;
        const match = node.value.match(pattern);
        if (match) {
          node.type = "listItem";
          node.children = [
            {
              type: "paragraph",
              __set_by_remark_quotation_plugin: true,
              children: [
                {
                  type: "text",
                  value: match[0],
                  __set_by_remark_quotation_plugin: true,
                },
              ],
            },
          ];

          // node.value = match[0];
        }
      });
    });
  };
};

export const remarkGradientPlugin = () => {
  return (tree) => {
    visit(tree, ["code", "text"], (node: any) => {
      const pattern =
        /(linear|radial)-gradient\([^(]*(\([^)]*\)[^(]*)*[^)]*\)/g;
      const match = node.value.match(pattern);
      if (match) {
        node.type = "image";
        node.url = `//:0`;
        node.alt = `color://${match[0]}`;
      }
    });
  };
};

export const remarkColorPlugin = () => {
  return (tree) => {
    visit(tree, ["code", "text"], (node: any) => {
      const pattern_hex = /#[0-9a-fA-F]{6}/g;
      const pattern_rgb = /rgb\(\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\)/g;
      const pattern_rgba =
        /rgba\(\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\)/g;

      const match_hex = node.value.match(pattern_hex);
      const match_rgb = node.value.match(pattern_rgb);
      const match_rgba = node.value.match(pattern_rgba);

      const match = match_hex || match_rgb || match_rgba;

      if (match) {
        node.type = "image";
        node.url = `//:0`;
        node.alt = `color://${match[0]}`;
      }
    });
  };
};
