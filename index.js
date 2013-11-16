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

exports.build_grid = function(tokens)
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

exports.build_function_table = function(grid)
{
    var table = {}

    for(var row=0; row<grid.length; ++row)
    {
        for(var col=0; col<grid[row].length; ++col)
        {
            if(grid[row][col].type === 'Function'
            && table[grid[row][col].id.literal] === undefined)
            {
                table[grid[row][col].id.literal] = {row:row, col:col}
            }
        }
    }

    return table
}

exports.run = function(grid)
{
    var table = exports.build_function_table(grid)

    console.log('function table:')
    for(var k in table)
    {
        console.log(table[k].row + ':' + table[k].col + ' #' + k)
    }

    exports.call(grid, table, 'main', [])
}

exports.call = function(grid, table, name, params)
{
    if(table[name] === undefined) throw new Error('missing function: #' + name)

    var entry = table[name]
    var fn = grid[entry.row][entry.col]

    // down
    for(var offset=0; offset<fn.length; ++offset)
    {
        exports.path(grid, table, entry.row + 1, entry.col + offset)
    }

    // right
    exports.path(grid, table, entry.row, entry.col + fn.length)

    // up
    for(var offset=fn.length-1; offset>=0; --offset)
    {
        exports.path(grid, table, entry.row - 1, entry.col + offset)
    }

    // left
    exports.path(grid, table, entry.row, entry.col - 1)
}

exports.path = function(grid, table, row, col)
{
    console.log('path: ' + row + ':' + col)
}

var filename = process.argv[2]
fs.readFile(filename, function(err, data)
{
    if(err) throw err
    try
    {
        var tokens = parser.parse(data.toString())
        var grid = exports.build_grid(tokens)
        exports.run(grid)
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
