'use strict';

(function () {

  var timeoutAboutUs_0;
  var timeoutAboutUs_1;
  var timeoutAboutUs_2;
  var timeoutCarousel;

  var sidenav;
  var sidenavInstance;
  var sidenavToggler = document.querySelectorAll('.header-mobile__sidenav-trigger')[0];

  document.addEventListener('DOMContentLoaded', function () {

    /**
     * carousel part
     */

    var swiper = new Swiper({
      el: '.swiper-container',
      initialSlide: Math.floor($('.swiper-slide').length / 2),
      spaceBetween: 20,
      slidesPerView: 'auto',
      centeredSlides: true,
      grabCursor: false,
      effect: 'scale',
      speed: 350,
      threshold: 5,
      // watchSlidesProgress: true,
      // watchSlidesVisibility: true,
      mousewheel: {
        enabled: false,
      },
      keyboard: {
        enabled: true,
      },
      scaleEffect: {
        slideShadows: false,
        depth: 200,
      },
    });

    swiper.on('slideChange', function () {
      _stopVideoById(swiper.previousIndex);
      _hideButtonById(swiper.previousIndex);
      _showPosterById(swiper.previousIndex);
      _showButtonById(swiper.activeIndex);
    });

    $('.swiper-slide').click(function (e) {
      e.preventDefault();

      var indexTo = $(this).index();
      var indexFrom = swiper.activeIndex;

      if (indexFrom !== indexTo) {
        var nextSlide = function () {
          clearTimeout(timeoutCarousel);
          if (swiper.activeIndex !== indexTo) {
            if (swiper.activeIndex < indexTo) {
              // emulate arrow keypress for smooth animate
              // if just call swiper.slideNext(), animate will break
              // TODO: Why? need understand this behavior...
              document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowRight', keyCode: 39}));
            } else if (swiper.activeIndex > indexTo) {
              document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowLeft', keyCode: 37}));
            }
            timeoutCarousel = setTimeout(nextSlide, 200);
          } else {
            //
          }
        };
        nextSlide();
      } else {
        _stopVideoById(swiper.activeIndex);
      }
    });

    function _setVideosStatuses() {
      const videos = document.getElementsByClassName('carousel__item-video');

      for (var i = 0; i < videos.length; i++) {
        videos[i].onloadedmetadata = function () {
          var i = parseInt(this.getAttribute('id').split('-')[1]);
          this.parentNode.querySelector('#play-button-' + i).setAttribute('data-can-play', true);

          // show the first (central) play-button
          if (i === swiper.activeIndex) {
            _showButtonById(i);
          }

          _addPlayClickListener();
        };
      }
    }

    function _hidePosterById(id) {
      document.getElementById('poster-' + id).classList.add('carousel__poster-wrapper_hide');
    }

    function _hideButtonById(id) {
      document.getElementById('play-button-' + id).classList.add('carousel__button-play_hide');
    }

    function _showPosterById(id) {
      document.getElementById('poster-' + id).classList.remove('carousel__poster-wrapper_hide');
    }

    function _showButtonById(id) {
      var button = document.getElementById('play-button-' + id);
      if (!!button.getAttribute('data-can-play') === true) {
        button.classList.remove('carousel__button-play_hide');
      }
    }
    function _playVideoById(id, i) {
      var video = document.getElementById(id);
      video.style.display = 'block';

      video.play();
      video.addEventListener('ended', function () {
        _showButtonById(i);
        _showPosterById(i);
        video.pause();
        video.currentTime = 0;
      });
    }

    function _stopVideoById(id) {
      var video = document.getElementsByClassName('carousel__video-wrapper')[id].getElementsByTagName('video')[0];

      if (video) {
        video.pause();
        video.currentTime = 0;
        video.style.display = 'none';
      }
      _showPosterById(id);
      _showButtonById(id);
    }

    function _addPlayClickListener() {
      $('.carousel__button-play').click(function (e) {
        e.stopPropagation();

        var splittedButtonId = $(this).attr('id').split('-');
        var i = parseInt(splittedButtonId[splittedButtonId.length - 1]);
        var videoId = 'video-' + i;

        _hidePosterById(i);
        _hideButtonById(i);
        _playVideoById(videoId, i);
      });
    };

    _setVideosStatuses();

    /**
     * sidenav part
     */

    sidenav = $('.sidenav').sidenav({
      edge: 'right',
      onOpenStart: function () {
        sidenavToggler.classList.add('is-active');
      },
      onCloseStart: function () {
        sidenavToggler.classList.remove('is-active');
      }
    });

    sidenavInstance = M.Sidenav.getInstance(sidenav);
    _sidenavToggleHandler(sidenavToggler);

    $('.header__item').click(function () {
      $('.sidenav').sidenav('close');
      var target = $(this)[0].dataset.target;

      if (window.location.pathname === '/policy.html') {
        window.location.href = window.location.origin + target;
      } else {
        $('html, body').stop(true, true).animate({
          scrollTop: $(target).offset().top - $('.header').outerHeight(),
        }, 1000);
      }
    });

    function _sidenavToggleHandler(toggle) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        if (!sidenavInstance.isOpen) {
          sidenavInstance.open();
        } else {
          sidenavInstance.close();
        }
      });
    }

    /**
     * waypoint part
     */

    $('#about-us').waypoint(function (dir) {
      $('#about-us h3')[0].classList.add('fadeIn');
      fadeInAboutUsItem(0);
      fadeInAboutUsItem(1);
      fadeInAboutUsItem(2);
    }, {
      offset: '70%'
    });

    $('#expertise').waypoint(function (dir) {
      if (dir === 'down') {
        fadeInExpertiseItem(0, 3);
        fadeInExpertiseItem(1, 4);
        fadeInExpertiseItem(2, 5);
        $('#expertise .index-video-block')[0].classList.add('fadeInUp');
      }
    }, {
      offset: '70%'
    });

    function fadeInAboutUsItem(item) {
      switch (item) {
        case 0:
          $('#about-us a')[item].classList.add('fadeInUp');
          $('#about-us p')[item].classList.add('fadeInUp');
          if (!timeoutAboutUs_0) {
            timeoutAboutUs_0 = setTimeout(function () {
              document.getElementById('about-us-video-' + item).play();
              document.getElementById('about-us-retina-video-' + item).play();
            }, 0);
          }
          break;
        case 1:
          $('#about-us a')[item].classList.add('fadeInUp');
          $('#about-us p')[item].classList.add('fadeInUp');
          if (!timeoutAboutUs_1) {
            timeoutAboutUs_1 = setTimeout(function () {
              document.getElementById('about-us-video-' + item).play();
              document.getElementById('about-us-retina-video-' + item).play();
            }, 1000);
          }
          break;
        case 2:
          $('#about-us a')[item].classList.add('fadeInUp');
          $('#about-us p')[item].classList.add('fadeInUp');
          if (!timeoutAboutUs_2) {
            timeoutAboutUs_2 = setTimeout(function () {
              document.getElementById('about-us-video-' + item).play();
              document.getElementById('about-us-retina-video-' + item).play();
            }, 3000);
          }
          break;
      }
    }

    function fadeInExpertiseItem(left, right) {
      $('#expertise .our-expertise-block__img')[left].classList.add('fadeInLeft');
      $('#expertise .our-expertise-block__title')[left].classList.add('fadeInLeft');
      $('#expertise .our-expertise-block__info')[left].classList.add('fadeInLeft');
      $('#expertise .our-expertise-block__img')[right].classList.add('fadeInRight');
      $('#expertise .our-expertise-block__title')[right].classList.add('fadeInRight');
      $('#expertise .our-expertise-block__info')[right].classList.add('fadeInRight');
    }

    // Expertise video

    $('#expertise-video-play-button').on('click', function () {
      var video = document.getElementById('expertise-video-1');
      var self = this;
      if (video) {
        video.play();
        $(self).css('display', 'none');
        video.addEventListener('ended', function () {
          video.pause();
          video.currentTime = 0;
          $(self).css('display', 'block');
        });
      }
    });

    // Menu underline

    function activateUnderlineMenu() {
      var navHeight = $('.header').outerHeight();
      var nav = $('#nav-menu');
      var sections = $('section');
      var underlineWidth;

      $(window).on('scroll', function (e) {
        var fromTop = $(this).scrollTop();

        sections.each(function(index) {
          var sectionHeight = $(this).outerHeight();
          var top = $(this).offset().top - navHeight * 1.5;
          var bottom = top + sectionHeight;
          if (fromTop >= top && fromTop <= bottom) {
            var active = nav.find('a[data-target="#'+$(this).attr('id')+'"]');
            var activeUnderline = active.siblings('.nav-underline');

            underlineWidth = active.parent().outerWidth();

            nav.find('a').removeClass('active');
            active.addClass('active');

            if (index !== sections.length - 1) {
              activeUnderline.css({
                left: ((((fromTop - top) / sectionHeight) * 100)) + '%',
              });
            }
          }
        });

        $('.nav-underline').css('width', underlineWidth + 'px');

      }).trigger('scroll');
    }

    activateUnderlineMenu();

  });

  window.addEventListener('beforeunload', function () {
    clearTimers();

    function clearTimers() {
      clearTimeout(timeoutAboutUs_0);
      clearTimeout(timeoutAboutUs_1);
      clearTimeout(timeoutAboutUs_2);
    }
  });

})();
