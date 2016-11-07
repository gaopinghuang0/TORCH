/*
 * Copyright (c) 2010 The Chromium Authors. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */

 function getLocation() {
	var selection = window.getSelection();
	var text = selection.toString();
	var oRange = selection.getRangeAt(0);  // get the text range
	var oRect = oRange.getBoundingClientRect();
	var relative=document.body.parentNode.getBoundingClientRect();
    return oRect.top-relative.top;
 }


// // Credit: http://stackoverflow.com/a/19738408/4246348
// $.fn.findText = function(params){
//     var phrases = params.query, 
//         ignorance = params.ignorecase;
//         wrapper = $(this);
//     var source = wrapper.html();
//     selection_class_name = params.style;
//     source = source.replace(/[\n|\t]+/gi, '');
//     source = source.replace(/\s+/gi, ' ');
//     source = source.replace(/> /gi, '>');
//     source = source.replace(/(\w)</gi, function(m, w){return(w + " <");});

//     phrases.forEach(function(str){
//         console.log(str)
//       var regexp = makeRegexp(str);
//         source = source.replace(regexp, function (m){
//           return (emulateSelection(m));
//         });

//     });
    
//     wrapper.html(source);
//     var res_array = wrapper.find("[search=xxxxx]") 
//     return(res_array);
// };


// function makeRegexp(s){
//   var space = '( )?(<span[^>]*>)?(</span[^>]*>)?( )?';
//     var result = s.replace(/\s/gi, space);
//     result = new RegExp(space + result + space, "gi");
//     return(result);
// }

// function emulateSelection (htmlPiece){
//   htmlPiece = htmlPiece.replace(/(?!=>)[^><]+(?=<)/g, function(w){
//     return(wrapWords(w));}
//   );
//   htmlPiece = htmlPiece.replace(/^[^><]+/, function(w){
//     return(wrapWords(w));}
//   );  
//   htmlPiece = htmlPiece.replace(/[^><]+$/, function(w){
//     return(wrapWords(w));}
//   );
//   htmlPiece = htmlPiece.replace(/^[^><]+$/, function(w){
//     return(wrapWords(w));}
//   );

//   return( htmlPiece );
// }

// function wrapWords(plainPiece){
//   // console.log("plain: " + plainPiece);
//   var start = '<span search="xxxxx" class="TORC-selected">',
//     stop = '</span>';
//   return(start + plainPiece + stop);
// }


function highlightText(text) {
    // unhighlight all highlighted text
    $('body').unhighlight({className: 'TORC-selected'})

    var query = splitQueryText(text)
    $('body').highlight(query, {className: 'TORC-selected'})
}

// greedily increase the length, once no match, split
// avoid single word
function splitQueryText(text) {
    var words = text.match(/\S+/g),
        query = [],
        start = 0,
        _query = '',
        html = $('body').html();
    do {
        start = splitHelper(words, html)
        _query = words.slice(0, start).join(' ')
        if (_query && start > 1) {
            query.push(_query)
        }
        start = start === 0 ? 1 : start;  // in case no match a single word
        words = words.slice(start)
    } while (start && words && words.length)
    // console.log(query)
    return query
}

// Credit: http://stackoverflow.com/a/6969486/4246348
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function splitHelper(words, html) {
    if (words.length <= 1) {
        return 0
    }
    var i = 0, reg;
    do {
        i++;
        reg = new RegExp(escapeRegExp(words.slice(0, i).join(' ')), 'gi')
        // console.log(i, reg)
    } while (reg.test(html) && i <= words.length)
    return i - 1;
}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.message === "get_location" && request.from === "eventpage") {

        var info = {'location': getLocation()}
        sendResponse(info);
    } else if (request.message === 'scroll_content' && request.from === 'popup') {
        console.log(request)
        if (request.location) {
            window.scrollTo(0, request.location - 30)
            highlightText(request.text)
            sendResponse('done')
        }
    }
});
