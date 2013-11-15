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

var gridify = function(tokens)
{
    var grid = []
    grid.push([])

    tokens.forEach(function(v)
    {
        switch(v.type)
        {
            case 'Line':
                grid.push([])
                break
            default:
                for(var i=0; i<v.length; ++i)
                {
                    grid[grid.length - 1].push(v)
                }
                break
        }
    })

    return grid
}

var evaluate = function(grid)
{
    var row, col

    find_main:
    for(row=0; row<grid.length; ++row)
    {
        for(col=0; col<grid[row].length; ++col)
        {
            if(grid[row][col].type === 'Function'
            && grid[row][col].id.literal === 'main')
            {
                break find_main
            }
        }
    }

    console.log('#main is at ' + row + ':' + col)

    // TODO: find all Function locations and store them in a table
}

var filename = process.argv[2]
fs.readFile(filename, function(err, data)
{
    if(err) throw err
    try
    {
        var tokens = parser.parse(data.toString())
        var grid = gridify(tokens)
        evaluate(grid)
        return

        var s = ''
        tokens.forEach(function(v)
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
                    s += v.type
                    break
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
