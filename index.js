/*
 *  Copyright 2013 David Farrell
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var util = require('util')
var fs = require('fs')
var parser = require('./parser')

var filename = process.argv[2]
fs.readFile(filename, function(err, data)
{
    if(err) throw err
    try
    {
        var parsed = parser.parse(data.toString())
        var s = ''

        parsed.forEach(function(v)
        {
            switch(v.type)
            {
                case 'Line':
                    s += '\n'
                    break
                case 'Space':
                    s += ' '
                    break
                case '+':
                case '-':
                case '*':
                case '/':
                case '==':
                    s += v.type
                    break
                case 'Down':
                    s += 'v'
                    break
                case 'Right':
                    s += '>'
                    break
                case 'Up':
                    s += '^'
                    break
                case 'Left':
                    s += '<'
                    break
                case 'Function':
                    s += '#' + v.id.literal
                    break
                case 'Identifier':
                case 'Number':
                    s += v.literal
                    break
                default:
                    throw new Error('unrecognized type: `' + v.type + '`')
            }
        })

        console.log('code:')
        console.log(s)
    }
    catch(e)
    {
        if(e.name === 'SyntaxError')
        {
            console.log(e.line + ':' + e.column + ' syntax error at `' + e.found + '`')
        }
        else throw e
    }
})
