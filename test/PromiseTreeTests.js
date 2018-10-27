const expect = require('chai').expect;
const PromiseTree = require('../lib/PromiseTree');
const {ExtendedPromiseTree} = require('../routes/PromiseTree')

describe('PromiseTree', function() {

    describe('constructor', function() {
        it('throws an error when the data is not an array', function() {
            expect(function() {
                new PromiseTree({});
            }).to.throw(Error);
        });

        it('accepts an array', function() {
            new PromiseTree([]);
        });
    });

    describe('#getRoot', function() {
        it('returns the root element', function () {
            var tree = new PromiseTree([{value: 'root'}]);
            return tree.getRoot()
                .then(function (root) {
                    expect(root.value).to.equal('root');
                });
        });
    });


    describe('#getNode', function() {
        it('returns the requested element', function () {
            var tree = new PromiseTree([
                {value: 'root', left: 1},
                {value: 'left'}
            ]);
            return tree.getNode(1)
                .then(function (node) {
                    expect(node.value).to.equal('left');
                });
        });
        
    });
    describe('#bigTree', function() {
        it('returns ordering', async function (done) {
            var tree = new ExtendedPromiseTree(
                [{value:"root",left:1,right:2},
                 {value:"L1", left: 4, right:3},
                 {value:"R1", left: 8},
                 {value:"R2", right: 7},
                 {value: "L2", left: 5, right: 6},
                 {value: "L3"},{value: "R3"},
                 {value: "R4"}, {value: "L5"}]);
            await tree.traverse({value:"root",left:1,right:2})
            expect(tree.result.length).to.equal(9);
            expect(tree.result).to.deep.equal([ 'L3', 'L2', 'R3', 'L1', 'R2', 'R4', 'root', 'L5', 'R1' ]);
            done();
        });

        it('asymetric use case', async function (done) {
            var tree = new ExtendedPromiseTree(
                [{value:"root",right:1},
                 {value:"R1", left: 2, right:3},
                 {value:"L1", left: 8, right: 4},
                 {value:"R2", left:5, right: 7},
                 {value: "L2", right: 6},
                 {value: "L3"},{value: "R3"},
                 {value: "R4"}, {value: "L5"}]);
            await tree.traverse({value:"root",right:1});
            expect(tree.result.length).to.equal(9);
            expect(tree.result).to.deep.equal([ 'root', 'L5', 'L1','L2', 'R3', 'R1' ,'L3', 'R2', 'R4' ]);
            done();
        });
    });
});