
# Test File Format

Test files are UTF-8 encoded text files. Each file represents a test script
to run. Each test script consists of a sequence of commands:

```
$contents = $text ($command $text)*
$text = any text that does not contain "$test."
$command = "$test.$" $commandName "(" $params ")"
$commandName = the command's name
$params = $param (";" $param)*
$param = a parameter as defined by $commandName
```

* Any whitespace at the beginning or at the end of $text will be automatically
  removed; i.e. all $text content will be trimmed.
* Any $text that preceeds the very first $command will be ignored and can
  therefore be used for documentation.
* Multiline commands are not supported; i.e. unlike $text, no $command should
  stretch over multiple lines.
* Each $param represents a parameter required by its $commandName.
  Its value must not contain a semicolon (;) character. Currently, no escaping
  is supported.
* Any $text that follows a $command can be considered as an additional implicit
  parameter for its preceeding $command.
* Commands that have an unknown $commandName will be ignored. Their implicit
  $text argument can be used for additional documentation.

## $comment()

```
"$test.$comment()" $text
"$test.$ignore()" $text
```

* $comment commands can be used for additional documentation, or to visually
  separate multiple commands from each other.
* $comment and $ignore commands are in fact unknown commands and will be
  silently be ignored.

## $options()

```
"$test.$options()" $text
$text = a stringified object in JSON format
```

* $text must be a JSON string that can be parsed into an options object.
  This object will be used as the outliner's options argument.
* Each test script may contain at most one $test.$options() command.

## $html(selector)

```
"$test.$html(" $selector ")" $text
$text = any html content
```

* $html commands are used to define the HTML content for which outlines will
  be created.
* $selector is used to pre-select the sectioning element for which to create
  the outline. Its value will be used like in JSDOM.document.querySelector(
  $selector) expressions and must be valid with regards to these expressions.
  As a consequence, outlines will only be created for the first matching DOM
  node.
* $text holds the HTML content for which to create the outline and can be any
  HTML content. $text can be partial HTML fragments, or a fully specified HTML
  document.
* Each script file must have exactly one $html($selector) command.

## $outline()

```
"$test.$outline()" $text
$text = ($line "\n")+
$line = $prefix \s $suffix
$prefix = ([1-9][0-9]*\.)+
$suffix = $key
```

* Essentially, $text defines what the outline generated by $test.$html()
  should look like.
* Each $line must be unique; should be guaranteed by each $prefix.
* Only one $outline() command per test script is allowed.
* $outline() commands must precede any $outline(line) commands.
* A $outline() command is not required. If none is specified, the test will
  merely try to parse the content given by $test.$html(selector). In such a
  case, no checks will be done to verify the generated outline.

## $outline(line)

```
"$test.$outline(" $key ")" $text
$key = a $line value from "$test.$outline()"
```

* Essentially, $text defines what an internal outline should look like.
* Only one $outline(line) command per $outline() $line is allowed.
* $outline(line) commands must be located after a $outline() command.
* If there is no $outline() command, then no $outline(line) commands are
  allowed.
