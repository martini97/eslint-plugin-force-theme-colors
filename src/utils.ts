// Most of these are based from this package:
// https://github.com/phobal/eslint-plugin-styled-no-color-value/tree/main

import pkg from '../package.json';
import { TSESTree } from '@typescript-eslint/experimental-utils';

const cssColorRegx =
  /(#[a-f\d]{8}|#[a-f\d]{6}|#[a-f\d]{3}|rgb *\((?: *\d{1,3}%? *,){2} *\d{1,3}%? *\)|rgba *\((?: *\d{1,3}%? *,){3}\s?(0?.\d+|0|1)? *\))\s*/i;

const cssColorKeywords = [
  'aliceblue',
  'antiquewhite',
  'aqua',
  'aquamarine',
  'azure',
  'beige',
  'bisque',
  'black',
  'blanchedalmond',
  'blue',
  'blueviolet',
  'brown',
  'burlywood',
  'cadetblue',
  'chartreuse',
  'chocolate',
  'coral',
  'cornflowerblue',
  'cornsilk',
  'crimson',
  'cyan',
  'darkblue',
  'darkcyan',
  'darkgoldenrod',
  'darkgray',
  'darkgreen',
  'darkkhaki',
  'darkmagenta',
  'darkolivegreen',
  'darkorange',
  'darkorchid',
  'darkred',
  'darksalmon',
  'darkseagreen',
  'darkslateblue',
  'darkslategray',
  'darkturquoise',
  'darkviolet',
  'deeppink',
  'deepskyblue',
  'dimgray',
  'dodgerblue',
  'firebrick',
  'floralwhite',
  'forestgreen',
  'fuchsia',
  'gainsboro',
  'ghostwhite',
  'gold',
  'goldenrod',
  'gray',
  'green',
  'greenyellow',
  'honeydew',
  'hotpink',
  'indianred',
  'indigo',
  'ivory',
  'khaki',
  'lavender',
  'lavenderblush',
  'lawngreen',
  'lemonchiffon',
  'lightblue',
  'lightcoral',
  'lightcyan',
  'lightgoldenrodyellow',
  'lightgrey',
  'lightgreen',
  'lightpink',
  'lightsalmon',
  'lightseagreen',
  'lightskyblue',
  'lightslategray',
  'lightsteelblue',
  'lightyellow',
  'lime',
  'limegreen',
  'linen',
  'magenta',
  'maroon',
  'mediumaquamarine',
  'mediumblue',
  'mediumorchid',
  'mediumpurple',
  'mediumseagreen',
  'mediumslateblue',
  'mediumspringgreen',
  'mediumturquoise',
  'mediumvioletred',
  'midnightblue',
  'mintcream',
  'mistyrose',
  'moccasin',
  'navajowhite',
  'navy',
  'oldlace',
  'olive',
  'olivedrab',
  'orange',
  'orangered',
  'orchid',
  'palegoldenrod',
  'palegreen',
  'paleturquoise',
  'palevioletred',
  'papayawhip',
  'peachpuff',
  'peru',
  'pink',
  'plum',
  'powderblue',
  'purple',
  'red',
  'rosybrown',
  'royalblue',
  'saddlebrown',
  'salmon',
  'sandybrown',
  'seagreen',
  'seashell',
  'sienna',
  'silver',
  'skyblue',
  'slateblue',
  'slategray',
  'snow',
  'springgreen',
  'steelblue',
  'tan',
  'teal',
  'thistle',
  'tomato',
  'turquoise',
  'violet',
  'wheat',
  'white',
  'whitesmoke',
  'yellow',
  'yellowgreen',
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
  return cssColorRegx.test(rule) || cssColorKeywords.some((color) => rule.toLowerCase().includes(color));
}

export function generateDocsUrl(rule: string): string {
  return `${pkg.homepage}#${rule}`;
}
