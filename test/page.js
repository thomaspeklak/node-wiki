var Page = require('../models/page'),
    assert = require('assert');

describe('page', function() {
   describe('#getSegments', function() {
       it('should split "/" as single array entry', function() {
           var page = new Page({ path: '/' });
           
           var segments = page.getPathSegments();
           
           assert.equal(segments.length, 1);
           assert.equal(segments[0], '/');
       });

       it('should split "/sub/moresub" as three array entries', function() {
           var page = new Page({ path: '/sub/moresub' });

           var segments = page.getPathSegments();

           assert.equal(segments.length, 3);
           assert.equal(segments[0], '/');
           assert.equal(segments[1], 'sub');
           assert.equal(segments[2], 'moresub');
       });

       it('should split path with trailing slashes like path without trailing slashes', function() {
           var page = new Page({ path: '/sub/' });

           var segments = page.getPathSegments();

           assert.equal(segments.length, 2);
           assert.equal(segments[0], '/');
           assert.equal(segments[1], 'sub');
       });
   });
    
   describe('#buildTree', function() {
       it('should build a single node for root', function() {
           var root = Page.buildTree([new Page({ path : '/', title : 'root' })]);
           
           assert.ok(root);
           assert.equal(root.title, 'root');
           assert.equal(root.path, '/');
       });

       it('should build a sub node for two pages', function() {
           var root = Page.buildTree([new Page({ path : '/', title : 'root' }), new Page({path : '/sub', title: 'sub' })]);

           assert.ok(root.nodes[0]);
           assert.equal(root.nodes[0].title, 'sub');
           assert.equal(root.nodes[0].path, '/sub');
       });
       
       it('should build multiple sub nodes', function() {
           var root = Page.buildTree([ 
               new Page({ path : '/', title : 'root' }), 
               new Page({path : '/sub', title: 'sub' }),
               new Page({path : '/anothersub', title: 'anothersub' })
           ]);

           assert.ok(root.nodes[0]);
           assert.equal(root.nodes[0].title, 'sub');
           assert.equal(root.nodes[0].path, '/sub');
           assert.equal(root.nodes[1].title, 'anothersub');
           assert.equal(root.nodes[1].path, '/anothersub');
       });
   });
});