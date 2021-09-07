abstract class MdxToken {}
abstract class TextToken extends MdxToken {}
abstract class HeadingToken extends TextToken {}

export class Heading1Token extends HeadingToken {}
export class Heading2Token extends HeadingToken {}
export class Heading3Token extends HeadingToken {}
export class Heading4Token extends HeadingToken {}
export class Heading5Token extends HeadingToken {}
export class Heading6Token extends HeadingToken {}

export class ParagraphToken extends MdxToken {}
export class CodeToken extends MdxToken {}
export class LineBreakToken extends MdxToken {}
export class CustomTagToken extends MdxToken {}
