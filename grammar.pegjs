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

{
    Symbol = function(type, size)
    {
        this.type = type
        this.size = size
    }

    SymbolFunction = function(id)
    {
        this.type = 'Function'
        this.id = id
        this.size = id.size + 1
    }

    SymbolIdentifier = function(literal)
    {
        this.type = 'Identifier'
        this.literal = literal
        this.size = literal.length
    }

    SymbolNumber = function(literal)
    {
        this.type = 'Number'
        this.literal = parseInt(literal)
        this.size = literal.length
    }
}

start
    = Symbol+

Symbol
    = Function
    / Identifier
    / Number
    / Operator
    / Direction
    / Junction
    / Space
    / NewLine

Function
    = "#" id:Identifier { return new SymbolFunction(id) }

Identifier
    = first:[A-Za-z_] rest:[A-Za-z_0-9]* { return new SymbolIdentifier(first + rest.join('')) }

Number
    = digits:[0-9]+ { return new SymbolNumber(digits.join('')) }

Operator
    = "+" { return new Symbol('+', 1) }
    / "-" { return new Symbol('-', 1) }
    / "*" { return new Symbol('*', 1) }
    / "/" { return new Symbol('/', 1) }
    / "==" { return new Symbol('==', 2) }

Direction
    = "v" { return new Symbol('Down', 1) }
    / ">" { return new Symbol('Right', 1) }
    / "^" { return new Symbol('Up', 1) }
    / "<" { return new Symbol('Left', 1) }

Junction
    = "." { return new Symbol('Junction', 1) }

Space
    = " " { return new Symbol('Space', 1) }

NewLine
    = ("\n" / "\r" / "\r\n") { return new Symbol('Line', 1) }
