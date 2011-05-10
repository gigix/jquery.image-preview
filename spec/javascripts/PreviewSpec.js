describe("jquery.image-preview.js", function() {
    beforeEach(function() {
        $('#fixture').remove();
        $('#previewBox').remove();
        var fixture = $("<div id='fixture' style='position:absolute; left:100px; top:200px;'>"
            + "<div id='eut' style='position:relative; left:50px; top:30px; width:45px; height:67px'>"
            + "Element Under Test</div>"
            + "<div id='resultSet' style='width:1024px'>"
            + "<div id='hoverElement' style='position:absolute; left:200px; top:200px; height:100px; width:100px;'>Mouse Hover On This</div>"
            + "</div>"
            + "<div id='previewBox' style='height:200px;width:200px; margin:5px'>This div will show when hover happens"
            + "<div id='mouseX' class='hideAll' /><div id='mouseY' class='hideAll' /></div>"
            + "</div>");
        $('body').append(fixture);
        $('#hoverElement').preview({
            'boundaryElement' : $('#resultSet'),
            'buildContent' : function(target){ return $("<div>Test</div>") }
        });
    });

    describe("windowScrollTop", function() {
       it('returns zero by default', function() {
          expect($.windowScrollTop()).toEqual(0);
       });
    });

    describe("topOfPreviewBox", function() {
       it("returns Y offset of preview box", function() {
          var target = $("#hoverElement");
          var previewBox = $("#previewBox");
          expect($(previewBox).topOfPreviewBox(target)).toEqual(350);
       });

       it("returns correct Y offset of preview box when scroll happens", function() {
          var target = $("#hoverElement");
          var previewBox = $("#previewBox");
          $.windowScrollTop = function() {
            return 500;
          }
          expect($(previewBox).topOfPreviewBox(target)).toEqual(500);
       });

       it("returns correct Y offset of preview box when hover on thumbnail at bottom", function() {
          var target = $("#hoverElement");
          var previewBox = $("#previewBox");

          $.windowScrollTop = function() {
            return 100;
          }
          $.windowHeight = function() {
            return 300;
          }

          expect($(previewBox).topOfPreviewBox(target)).toEqual(185);
       });
    });

    describe("leftOfPreviewBox", function() {
       it("returns X offset of previewBox", function(){
          var target = $("#hoverElement");
          var previewBox = $("#previewBox");
          expect($(previewBox).leftOfPreviewBox(target)).toEqual(250);
       });

       it("returns correct X offset of previewBox when overflows right boundary", function(){
          $("#resultSet").css('width', '210px')

          var target = $("#hoverElement");
          var previewBox = $("#previewBox");
          expect($(previewBox).leftOfPreviewBox(target)).toEqual(110);
       });
    });

    describe("getX", function() {
        it("returns X offset of given element", function() {
            expect($('#eut').getX()).toEqual(150);
        });
    });

    describe("getY", function() {
        it("returns Y offset of given element", function() {
            expect($('#eut').getY()).toEqual(230);
        });
    });

    describe("width", function() {
        it("returns width of given element", function() {
            expect($('#eut').width()).toEqual(45);
        });
    });

    describe("height", function() {
        it("returns height of given element", function() {
            expect($('#eut').height()).toEqual(67);
            expect($('#previewBox').height()).toEqual(200);
        });
    });

    describe("within", function() {
        it("returns false if given location is not in given element", function() {
            expect($("#previewBox").within(0, 0)).toEqual(false);
        });

        it("returns true if given location is in given element", function() {
            expect($("#fixture").within(101, 201)).toEqual(true);
        });
    });

    describe('isMouseIn', function() {
        it("returns true if current mouse location is in given element", function() {
            $("#mouseX").text(101);
            $("#mouseY").text(201);
            expect($("#fixture").isMouseIn()).toEqual(true);
        });

        it("returns false if current mouse location is not in given element", function() {
            $("#mouseX").text(1);
            $("#mouseY").text(2);
            expect($("#fixture").isMouseIn()).toEqual(false);
        });
    });
});