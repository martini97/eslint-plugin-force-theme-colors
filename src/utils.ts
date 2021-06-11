// Most of these are based from this package:
// https://github.com/phobal/eslint-plugin-styled-no-color-value/tree/main

import pkg from '../package.json';
import { TSESTree } from '@typescript-eslint/experimental-utils';

const cssColorRegx =
  /(#[a-f\d]{8}|#[a-f\d]{6}|#[a-f\d]{3}|rgb *\((?: *\d{1,3}%? *,){2} *\d{1,3}%? *\)|rgba *\((?: *\d{1,3}%? *,){3}\s?(0?.\d+|0|1)? *\))\s*/i;

const cssColorKeywords = [
  /\baliceblue\b/,
  /\bantiquewhite\b/,
  /\baqua\b/,
  /\baquamarine\b/,
  /\bazure\b/,
  /\bbeige\b/,
  /\bbisque\b/,
  /\bblack\b/,
  /\bblanchedalmond\b/,
  /\bblue\b/,
  /\bblueviolet\b/,
  /\bbrown\b/,
  /\bburlywood\b/,
  /\bcadetblue\b/,
  /\bchartreuse\b/,
  /\bchocolate\b/,
  /\bcoral\b/,
  /\bcornflowerblue\b/,
  /\bcornsilk\b/,
  /\bcrimson\b/,
  /\bcyan\b/,
  /\bdarkblue\b/,
  /\bdarkcyan\b/,
  /\bdarkgoldenrod\b/,
  /\bdarkgray\b/,
  /\bdarkgreen\b/,
  /\bdarkkhaki\b/,
  /\bdarkmagenta\b/,
  /\bdarkolivegreen\b/,
  /\bdarkorange\b/,
  /\bdarkorchid\b/,
  /\bdarkred\b/,
  /\bdarksalmon\b/,
  /\bdarkseagreen\b/,
  /\bdarkslateblue\b/,
  /\bdarkslategray\b/,
  /\bdarkturquoise\b/,
  /\bdarkviolet\b/,
  /\bdeeppink\b/,
  /\bdeepskyblue\b/,
  /\bdimgray\b/,
  /\bdodgerblue\b/,
  /\bfirebrick\b/,
  /\bfloralwhite\b/,
  /\bforestgreen\b/,
  /\bfuchsia\b/,
  /\bgainsboro\b/,
  /\bghostwhite\b/,
  /\bgold\b/,
  /\bgoldenrod\b/,
  /\bgray\b/,
  /\bgreen\b/,
  /\bgreenyellow\b/,
  /\bhoneydew\b/,
  /\bhotpink\b/,
  /\bindianred\b/,
  /\bindigo\b/,
  /\bivory\b/,
  /\bkhaki\b/,
  /\blavender\b/,
  /\blavenderblush\b/,
  /\blawngreen\b/,
  /\blemonchiffon\b/,
  /\blightblue\b/,
  /\blightcoral\b/,
  /\blightcyan\b/,
  /\blightgoldenrodyellow\b/,
  /\blightgrey\b/,
  /\blightgreen\b/,
  /\blightpink\b/,
  /\blightsalmon\b/,
  /\blightseagreen\b/,
  /\blightskyblue\b/,
  /\blightslategray\b/,
  /\blightsteelblue\b/,
  /\blightyellow\b/,
  /\blime\b/,
  /\blimegreen\b/,
  /\blinen\b/,
  /\bmagenta\b/,
  /\bmaroon\b/,
  /\bmediumaquamarine\b/,
  /\bmediumblue\b/,
  /\bmediumorchid\b/,
  /\bmediumpurple\b/,
  /\bmediumseagreen\b/,
  /\bmediumslateblue\b/,
  /\bmediumspringgreen\b/,
  /\bmediumturquoise\b/,
  /\bmediumvioletred\b/,
  /\bmidnightblue\b/,
  /\bmintcream\b/,
  /\bmistyrose\b/,
  /\bmoccasin\b/,
  /\bnavajowhite\b/,
  /\bnavy\b/,
  /\boldlace\b/,
  /\bolive\b/,
  /\bolivedrab\b/,
  /\borange\b/,
  /\borangered\b/,
  /\borchid\b/,
  /\bpalegoldenrod\b/,
  /\bpalegreen\b/,
  /\bpaleturquoise\b/,
  /\bpalevioletred\b/,
  /\bpapayawhip\b/,
  /\bpeachpuff\b/,
  /\bperu\b/,
  /\bpink\b/,
  /\bplum\b/,
  /\bpowderblue\b/,
  /\bpurple\b/,
  /\bred\b/,
  /\brosybrown\b/,
  /\broyalblue\b/,
  /\bsaddlebrown\b/,
  /\bsalmon\b/,
  /\bsandybrown\b/,
  /\bseagreen\b/,
  /\bseashell\b/,
  /\bsienna\b/,
  /\bsilver\b/,
  /\bskyblue\b/,
  /\bslateblue\b/,
  /\bslategray\b/,
  /\bsnow\b/,
  /\bspringgreen\b/,
  /\bsteelblue\b/,
  /\btan\b/,
  /\bteal\b/,
  /\bthistle\b/,
  /\btomato\b/,
  /\bturquoise\b/,
  /\bviolet\b/,
  /\bwheat\b/,
  /\bwhite\b/,
  /\bwhitesmoke\b/,
  /\byellow\b/,
  /\byellowgreen\b/,
];

export function isStyledTagname(node: any): boolean {
  return (
    (node.tag.type === 'Identifier' && node.tag.name === 'css') ||
    (node.tag.type === 'MemberExpression' && node.tag.object.name === 'styled') ||
    (node.tag.type === 'CallExpression' &&
      (node.tag.callee.name === 'styled' ||
        (node.tag.callee.object &&
          ((node.tag.callee.object.callee && node.tag.callee.object.callee.name === 'styled') ||
            (node.tag.callee.object.object && node.tag.callee.object.object.name === 'styled')))))
  );
}

export function getNodeStyles(node: TSESTree.TaggedTemplateExpression): string {
  const [firstQuasi, ...quasis] = node.quasi.quasis;
  // remove line break added to the first quasi
  const lineBreakCount = node.quasi.loc.start.line - 1;
  let styles = `${'\n'.repeat(lineBreakCount)}${' '.repeat(node.quasi.loc.start.column + 1)}${firstQuasi.value.raw}`;

  // replace expression by spaces and line breaks
  quasis.forEach(({ value, loc }, idx) => {
    const prevLoc = idx === 0 ? firstQuasi.loc : quasis[idx - 1].loc;
    const lineBreaksCount = loc.start.line - prevLoc.end.line;
    const spacesCount =
      loc.start.line === prevLoc.end.line ? loc.start.column - prevLoc.end.column + 2 : loc.start.column + 1;
    styles = `${styles}${' '}${'\n'.repeat(lineBreaksCount)}${' '.repeat(spacesCount)}${value.raw}`;
  });

  return styles;
}

export function getValuesFromTernary(node: TSESTree.TaggedTemplateExpression): string[] {
  return node.quasi.expressions
    .filter(({ type }) => type === 'ConditionalExpression')
    .map(({ consequent, alternate }: any) => {
      const values = [];
      if (consequent.type === 'Literal') values.push(consequent.value);
      if (alternate.type === 'Literal') values.push(alternate.value);
      return values;
    })
    .flat();
}

export function hasHardcodedColor(rule: string): boolean {
  return cssColorRegx.test(rule) || cssColorKeywords.some((color) => color.test(rule));
}

export function generateDocsUrl(rule: string): string {
  return `${pkg.homepage}#${rule}`;
}
