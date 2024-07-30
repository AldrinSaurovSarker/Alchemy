const allItems = {
    "rose": {
        emoji: "🌹",
        description: "The symbol of love for thousand years"
    },
    "sunflower": {
        emoji: "🌻",
        description: "The flower that follows the sun"
    }
}

const mergePairs = {
    "flower-heart": {name: "rose", emoji: "🌹"},
    "heart-flower": {name: "rose", emoji: "🌹"},
    "flower-sun": {name: "sunflower", emoji: "🌻"},
    "sun-flower": {name: "sunflower", emoji: "🌻"},
    "bird-night": {name: "owl", emoji: "🦉"},
    "night-bird": {name: "owl", emoji: "🦉"}
};

var zIndex = 0;
var itemsData = [];

function detectCollision(draggedItem) {
    var itemPos = draggedItem.offset();
    var itemWidth = draggedItem.outerWidth();
    var itemHeight = draggedItem.outerHeight();
    
    var collidingItems = [];

    $(".item").not(draggedItem).each(function() {
        var $otherItem = $(this);
        var otherItemPos = $otherItem.offset();
        var otherItemWidth = $otherItem.outerWidth();
        var otherItemHeight = $otherItem.outerHeight();

        if (itemPos.left < otherItemPos.left + otherItemWidth &&
            itemPos.left + itemWidth > otherItemPos.left &&
            itemPos.top < otherItemPos.top + otherItemHeight &&
            itemPos.top + itemHeight > otherItemPos.top) {
            collidingItems.push({
                zIndex: parseInt($otherItem.css("z-index"), 10),
                name: $otherItem.data("name"),
                element: $otherItem
            });
        }
    });

    if (collidingItems.length > 0) {
        collidingItems.sort((a, b) => b.zIndex - a.zIndex);
        var highestZIndexItem = collidingItems[0];
        checkForMerge(draggedItem, highestZIndexItem);
    }
}

function checkForMerge($draggedItem, highestZIndexItem) {
    var draggedItemName = $draggedItem.data("name");
    var highestZIndexItemName = highestZIndexItem.name;
    
    var combination1 = draggedItemName + "-" + highestZIndexItemName;
    var combination2 = highestZIndexItemName + "-" + draggedItemName;
    
    if (mergePairs[combination1]) {
        merge($draggedItem, highestZIndexItem, mergePairs[combination1]);
    } else if (mergePairs[combination2]) {
        merge($draggedItem, highestZIndexItem, mergePairs[combination2]);
    } else {
        $draggedItem.addClass("shake");
        setTimeout(function() {
            $draggedItem.removeClass("shake");
            void $draggedItem[0].offsetHeight;
            $draggedItem.addClass("shake");
        }, 0);
        setTimeout(function() {
            $draggedItem.removeClass("shake");
        }, 1000);
    }
}

function merge($draggedItem, highestZIndexItem, mergeResult) {
    var draggedItemPos = $draggedItem.offset();
    var highestItemPos = highestZIndexItem.element.offset();

    var avgTop = (draggedItemPos.top + highestItemPos.top) / 2;
    var avgLeft = (draggedItemPos.left + highestItemPos.left) / 2;

    var canvasOffset = $('#canvas').offset();
    var borderTopWidth = parseInt($('#canvas').css('border-top-width'), 10);
    var borderLeftWidth = parseInt($('#canvas').css('border-left-width'), 10);

    var relativeTop = avgTop - canvasOffset.top - borderTopWidth;
    var relativeLeft = avgLeft - canvasOffset.left - borderLeftWidth;

    var $newItem = $('<div class="item">')
            .attr('data-name', mergeResult.name)
            .css({
                position: 'absolute',
                top: relativeTop,
                left: relativeLeft,
                zIndex: zIndex++,
                visibility: 'hidden'
            })
            .append('<div class="emoji">' + mergeResult.emoji + '</div>')  
            .append('<div class="name">' + mergeResult.name + '</div>');

            $('#canvas').append($newItem);

    var newItemWidth = $newItem.outerWidth();
    var newItemHeight = $newItem.outerHeight();

    var $mergeAnimation = $('<div class="merge-animation">')
        .css({
            position: 'absolute',
            top: relativeTop + newItemHeight/2 - 100,
            left: relativeLeft + newItemWidth/2 - 100,
            zIndex: zIndex++
        });

    $('#canvas').append($mergeAnimation);

    $draggedItem.fadeOut(500, function() {
        $draggedItem.remove();
    });

    highestZIndexItem.element.fadeOut(500, function() {
        highestZIndexItem.element.remove();
    });

    if (!itemsData.includes(mergeResult.name)) {
        itemsData.push(mergeResult.name);
        discovery(mergeResult.name);
    }

    setTimeout(function() {
        $mergeAnimation.remove();

        $newItem.css({
            visibility: 'visible'
        });

        $newItem.draggable({
            start: function(event, ui) {
                zIndex++;
                $(this).css("z-index", zIndex);
            },
            stop: function(event, ui) {
                var $draggedItem = $(this);
                var itemPos = $draggedItem.offset();
                var canvasPos = $("#canvas").offset();
                var canvasWidth = $("#canvas").outerWidth();
                var canvasHeight = $("#canvas").outerHeight();

                if (
                    itemPos.left > canvasPos.left + canvasWidth ||
                    itemPos.top > canvasPos.top + canvasHeight ||
                    itemPos.left + $draggedItem.outerWidth() < canvasPos.left ||
                    itemPos.top + $draggedItem.outerHeight() < canvasPos.top
                ) {
                    $draggedItem.remove();
                } else {
                    detectCollision($draggedItem);
                }
            }
        });
    }, 500);
}

function discovery(itemName) {
    var item = allItems[itemName];

    const canvas = document.querySelector('#game-container');
    canvas.classList.add('d-none');
    canvas.classList.remove('d-flex');

    const discovery = document.querySelector('.discovery');
    discovery.classList.remove('d-none');
    discovery.classList.add('d-flex');

    document.querySelector('.item-name').innerHTML = itemName;
    document.querySelector('.item-description').innerHTML = item.description;

    discovery.addEventListener('click', function (event) {
        discovery.classList.add('d-none');
        discovery.classList.remove('d-flex');
        
        canvas.classList.remove('d-none');
        canvas.classList.add('d-flex');
    })
}

$(document).ready(function() {
    $(".item").draggable({
        start: function(event, ui) {
            zIndex++;
            $(this).css("z-index", zIndex);
        },
        stop: function(event, ui) {
            var $draggedItem = $(this);
            var itemPos = ui.helper.offset();
            var canvasPos = $("#canvas").offset();
            var canvasWidth = $("#canvas").outerWidth();
            var canvasHeight = $("#canvas").outerHeight();

            if (
                itemPos.left > canvasPos.left + canvasWidth ||
                itemPos.top > canvasPos.top + canvasHeight ||
                itemPos.left + ui.helper.outerWidth() < canvasPos.left ||
                itemPos.top + ui.helper.outerHeight() < canvasPos.top
            ) {
                $draggedItem.remove();
            } else {
                detectCollision($draggedItem);
            }
        }
    });
});
