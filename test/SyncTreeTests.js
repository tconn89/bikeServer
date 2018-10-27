var expect = require('chai').expect;
var SyncTree = require('../lib/SyncTree');
const { ExtendedSyncTree } = require('../routes/SyncTree')

describe('SyncTree', function() {

    describe('constructor', function() {
        it('throws an error when the data is not an array', function() {
            expect(function() {
                new SyncTree({});
            }).to.throw(Error);
        });

        it('accepts an array', function() {
            new SyncTree([]);
        });
    });

    describe('#getRoot', function() {
        it('returns the root element', function () {
            var tree = new SyncTree([{value: 'root'}]);
            expect(tree.getRoot().value).to.equal('root');
        });
    });


    describe('#getNode', function() {
        it('returns the requested element', function () {
            var tree = new SyncTree([
                {value: 'root', left: 1},
                {value: 'left'}
            ]);
            expect(tree.getNode(1).value).to.equal('left');
        });
        
    });
    describe('#bigTree', function() {
        it('returns ordering', function (done) {
            var tree = new ExtendedSyncTree(
                [{value:"root",left:1,right:2},
                 {value:"L1", left: 4, right:3},
                 {value:"R1", left: 8},
                 {value:"R2", right: 7},
                 {value: "L2", left: 5, right: 6},
                 {value: "L3"},{value: "R3"},
                 {value: "R4"}, {value: "L5"}]);
            tree.traverse({value:"root",left:1,right:2})
            expect(tree.result.length).to.equal(9);
            expect(tree.result).to.deep.equal([ 'L3', 'L2', 'R3', 'L1', 'R2', 'R4', 'root', 'L5', 'R1' ]);
            done();
        });
        it('asymetric use case', function (done) {
            var tree = new ExtendedSyncTree(
                [{value:"root",right:1},
                 {value:"R1", left: 2, right:3},
                 {value:"L1", left: 8, right: 4},
                 {value:"R2", left:5, right: 7},
                 {value: "L2", right: 6},
                 {value: "L3"},{value: "R3"},
                 {value: "R4"}, {value: "L5"}]);
            tree.traverse({value:"root",right:1});
            expect(tree.result.length).to.equal(9);
            expect(tree.result).to.deep.equal([ 'root', 'L5', 'L1','L2', 'R3', 'R1' ,'L3', 'R2', 'R4' ]);
            done();
        });
    });
    
});
