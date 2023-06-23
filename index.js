var username;
var wallpaper;
var userpass;
var userpasstype;

function fileSystemAPI(read, write, type, location) {

}

function showUACPopup() {
  originApplication = this.caller;
  confirm("Allow this application to a make changes to your device? \n \n" + originApplication + "\n This application has not been authorized and may cause harm to your device.")
}

function load(name) {
  if (name == "userpass" || name == "userpasstype") {
    showUACPopup()
  }else {
    return window.localStorage.getItem(name);
  }
}

// SECURITY RISK!!!
// function store(name, data) {
//   return window.localStorage.setItem(name, data);
// }

$(document).ready(function() {
  if (load("init") != 'true') {
    username = load("username");
    wallpaper = load("wallpaper");
    userpass = load("userpass", syscodeAPI);
    userpasstype = load("userpasstype", syscodeAPI);
  } else {
    window.localStorage.setItem("init", "true")
    username = 'Nova Space';
    wallpaper = '1';
    userpass = 'none';
    userpasstype = 'none';
  }

  $(".loading_screen").delay(100).fadeOut(350, function() {
    $(this).remove(); // Removes the element from the DOM after fade-out is complete
  });
});

function maximizeWindow(windowId, handlerButton) {
  var windowDiv = $("#" + windowId);
  var windowContent = windowDiv.find('.window-content');

  if (windowDiv.hasClass('maximized')) {
    // Restore the window to its original size with transition
    var originalSize = windowDiv.data('originalSize');
    windowDiv.animate({
      width: originalSize.width,
      height: originalSize.height,
      top: originalSize.top,
      left: originalSize.left
    }, 300);

    windowDiv.removeClass('maximized');
    handlerButton.classList.remove('maximized');
  } else {
    // Store the original size and position of the window
    var originalSize = {
      width: windowDiv.width(),
      height: windowDiv.height(),
      top: windowDiv.css('top'),
      left: windowDiv.css('left')
    };
    windowDiv.data('originalSize', originalSize);

    // Maximize the window with transition
    var desktopWidth = $('.desktop').width();
    var desktopHeight = $('.desktop').height();
    windowDiv.animate({
      width: '100vw',
      height: '100vh',
      top: '0',
      left: '0'
    }, 300);

    windowDiv.addClass('maximized');
    handlerButton.classList.add('maximized');
  }
}

function minimizeWindow(windowId, handlerButton) {
  var windowDiv = $("#" + windowId);
  var windowContent = windowDiv.find('.window-content');

  if (windowDiv.hasClass('minimized')) {
    // Restore the window to its original position and size with transition
    var originalPosition = windowDiv.data('originalPosition');
    var originalSize = windowDiv.data('originalSize');
    windowDiv.animate({
      opacity: 1,
      transform: 'scale(0.8)'
    }, 300, function() {
      windowDiv.removeClass('minimized');
      handlerButton.classList.remove('minimized');
      windowDiv.css({
        top: originalPosition.top,
        left: originalPosition.left,
        width: originalSize.width,
        height: originalSize.height
      })
    });
  } else {
    // Store the original position and size of the window
    var currentPosition = {
      top: windowDiv.css('top'),
      left: windowDiv.css('left')
    };
    var currentSize = {
      width: windowDiv.width(),
      height: windowDiv.height()
    };
    windowDiv.data('originalPosition', currentPosition);
    windowDiv.data('originalSize', currentSize);

    // Minimize the window with transition
    var desktopHeight = $('.desktop').height();
    windowDiv.animate({
      opacity: 0,
      transform: 'scale(0.8)'
    }, 300, function() {
      windowDiv.addClass('minimized');
      handlerButton.classList.add('minimized');
      windowDiv.css({
        left: 0,
        top: 0,
        height: 0,
        width: 0
      })
    });
  }
}

function openApplication(htmlFile, className, handlerButton) {
  $.get(htmlFile, function(data) {
    var windowId = className.replace('.', '') + '-' + Math.floor(Math.random() * 1000); // Generate a unique window ID
    var existingIds = $('.window').map(function() {
      return this.id;
    }).get();

    while (existingIds.includes(windowId)) {
      windowId = className.replace('.', '') + '-' + Math.floor(Math.random() * 1000); // Regenerate ID if collision occurs
    }

    var windowDiv = $('<div>').attr('id', windowId).addClass('window').html($.parseHTML(data));
    var windowContent = windowDiv.find('.window-content');

    if (windowContent.length === 0) {
      windowContent = $('<div>').addClass('window-content');
      windowDiv.append(windowContent);
    }

    windowDiv.data('htmlFile', htmlFile); // Store the HTML file path in data attribute

    $('.desktop').append(windowDiv); // Append to the .desktop div

    // Initialize draggable functionality using jQuery UI
    windowDiv.draggable({
      handle: '.window-header'
    });

    // Initialize resizable functionality using jQuery UI
    windowDiv.resizable({
      handles: 'n, e, s, w, ne, se, sw, nw'
    });

    // Check if the window header already exists in the HTML file
    var windowHeader = windowDiv.find('.window-header');

    // If the header doesn't exist, create it
    if (windowHeader.length === 0) {
      windowHeader = $('<div>').addClass('window-header');
      windowDiv.prepend(windowHeader);
    }

    // Check if the window controls already exist in the HTML file
    var windowControls = windowHeader.find('.window-controls');

    // If controls don't exist, create them
    if (windowControls.length === 0) {
      windowControls = $('<div>').addClass('window-controls');
      windowHeader.append(windowControls);
    }

    // Event handler for opening animation
    windowDiv.css('opacity', 0).css('transform', 'scale(0.8)');
    setTimeout(function() {
      windowDiv.addClass('open').css('opacity', 1).css('transform', 'scale(1)');
    }, 0);

    // Event handler for close button with transition
    windowControls.on('click', '.close-button', function() {
      windowDiv.animate({
        transform: 'scale(0.8)',
        opacity: 0
      }, 300, function() {
        windowDiv.removeClass('open').remove();
      });
    });

    // Event handler for minimize button
    windowControls.on('click', '.minimize-button', function() {
      minimizeWindow(windowId, handlerButton);
    });

    // Event handler for maximize button
    windowControls.on('click', '.maximize-button', function() {
      maximizeWindow(windowId, handlerButton);
    });

  });
}

$(".launch").click(function() {
  var existingWindow = $('.window');

  if (existingWindow.length > 0) {
    var windowId = existingWindow.attr('id');
    minimizeWindow(windowId, this);
  } else {
    openApplication("apps/" + this.classList[1] + ".html", ".window", this);
  }
});
