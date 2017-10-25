# FormValidator

[![GitHub issues](https://img.shields.io/github/issues/HamHwong/FormValidator.svg)](https://github.com/HamHwong/FormValidator/issues) [![GitHub forks](https://img.shields.io/github/forks/HamHwong/FormValidator.svg)](https://github.com/HamHwong/FormValidator/network)
 [![GitHub stars](https://img.shields.io/github/stars/HamHwong/FormValidator.svg)](https://github.com/HamHwong/FormValidator/stargazers)

## Introduction

> A form validator component based on Jquery and Bootstrap sheet style, More easy for validate values filled in input,areatext,checkbox,select,etc... HTML components. you can configure the _RegExp_ rule in 'regxRule' object or just put them in `data-regxRule` attribute.

> ### regxRule Attribute option

> 1. Regex String, like `\\w[-\\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\\.)+[A-Za-z]{2,14}`
> 2. Function Name
> 3. RejectRule subobject name

# Usage

## Component Structure

```html
<form class="form-horizontal" role="form" data-validator="true">
  <div class="form-group">
    <input class="form-control" data-regxRule="number(10,14)" />
  </div>
</form>
```

> Required a **form** label with attribute **_data-validator_** to enable the validator work on it .

> > `Parameter` : `data-validator`

> > `Options` : `true` or `false`

> And a **div** label ,to locate the `warning` , with `input` or `textarea` or `select` inside.

> for those components in `div`, there will be an attribute called `data-regxRule`

> > `Parameter` : `data-regxRule`

> > `Options` : `RegExp string` , `function` , `rule name`

## Usage

### Bind events

```html
<script type="text/javascript" src="validator.js"></script>
<script type="text/javascript" src="regxRule.js"></script>

<script type="text/javascript">
  window.onliad = function(){
    validatoe.init()
  }
</script>
```

### Commit validate

```javascript
  validator.validateResult()
  //It will validate current page's and return result
  //return bool as TRUE or FALSE
```
