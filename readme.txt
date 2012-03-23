:
: Readme.txt
:

------------------------------------------------------

Version 3.0.3 Mar 22, 2012

New features:
- You can have the breadcrumb path displayed below the page title

Fixed:
- Paypal shopping cart opened in the main window, replacing the album (not as a popup) on IE
- Map did not display properly in certain circumstances
- void "Help" link on pages without images
- Preformat text and target="_blank" in links might conflict
- "Search..." placeholder text in the search box made translateable

Updated:
- French translation

Known issues:
- Sending locale information to Paypal has implemented, though it doesn't seem to accept

------------------------------------------------------

Version 3.0.2 Mar 15, 2012

New features:
- You can set the default visibility of the Photo data, Map and Selling photos panels, 
  that is you can show them by default, the visitors don't need to click the toggle button
- You can skip the folders from the top navigation bar - useful if you have too many folders

Fixed:
- Handling the folder descriptions (preformatting and using variables) is unified throughout 
  the albums
- Multi-line menus look better (don't overlap the page title)
- Map did not display in full width after hiding and showing the panel again

------------------------------------------------------

Version 3.0.1 Mar 13, 2012

New features:
- You can skip the folders from the thumbnail list (if you prefer the top navigation bar)
- Option to remove the "Help" link from the footer area

Fixed:
- Top navigation bar was too deep on IE and FireFox
- Links in folder descriptions got broken in the header
- Replacing index.htt with your own caused an extra "index" link in the navigation bars
- Control bar and panel background graphics could disppear and re-appear only after a page refresh
- The logo in the top navigation could run out of the bar 

Updated:
- French translation

------------------------------------------------------

Version 3.0.0 Mar 01, 2012

New features:
- Support for custom pages
- Multi-level top navigation bar
- Simple bottom navigation bar in the footer
- Better vertically split index page mode
- Updated icons and colors to improve the buttons visibility on the index page
- Share button is integrated better with the other (Info, Search) buttons
- Home button in the navigation bar
- Search within custom pages too
- Thumbnail captions can be placed below the thumbs
- You can add a logo and use as Home link in the top navigation bar
- Background image can be added to every style and you can position and tile whatever you like
- Image count in footer can be hidden 
- Modified "new" date calculation is based on Exif original date (if found)

Fixed:
- Search works with PNG and GIF files too
- Partly cut off footer area in FireFox
- Control bar did not disappear on touch devices
- Too dark gradient on the theme image in IE
- Folder image was re-generated with every Make unnecessarily
- Map was bleeding on the right edge if the image width was too large
- Text readability fixed with some styles

Updated:
- Swedish, Hungarian, Italian, German, Finnish and Spanish translations

Known issues:
- Image count now includes non-album pages, because jAlbum don't yet have a function to separately count the images

------------------------------------------------------

Version 2.3.0 Feb 2, 2012

New features:
- Search in the whole album by file names, titles and captions

Fixed:
- New indicator marked a folder 'new' even if only a comment or the folder icon has changed
- some javascript bugs related to the popup labels

------------------------------------------------------

Version 2.2.1 Feb 1, 2012

New:
- French translation has updated thanks to Danamel

Fixed:
- Gray style's gradient broken on IE
- Shipping cost incorrectly added in some cases

------------------------------------------------------

Version 2.2.0 Jan 31, 2012

New features:
- You can control what will happen after moving beyond the last frame: "Nothing", "Start over", "Go one level up", "Go back to index page" or "Ask the user"

Fixed:
- The "New" indicator was not working with only folders in an album
- Share button was showing all the share options (not only the selected ones) with albums containing only folders 
- Paypal "View cart" button reported something's wrong with the user's site
- extra 20px gap above thumbnails when there were no folders
- Gray style's gradient was too dark on IE7-8

Changed:
- The minimum width for the Folder name has been set to 100px (70px before) so the skin will automatically switch to the "thumbnail above, text below" mode if less space has left next to the thumbnail (raise the number of columns - Settings / Pages / Columns - to see)

------------------------------------------------------

Version 2.1.11 Jan 9, 2012

New feature:
- Stick control bar to top (for those preferred Turtle 1.x's control bar placed on the screen top)

Fixed:
- Paypal's shipping fee hasn't been added

------------------------------------------------------

Version 2.1.10 Dec 6, 2011

Fixed:
- Google Maps did not work in some cases
- thumbnail scroller has an extra 40px left margin
- .stop() on undefined element javascript error
- the header's bottom rounding is rough and visible on FireFox

------------------------------------------------------

Version 2.1.9 Dec 5, 2011

Fixed:
- Thumbnails did not show up on the first view but worked fine after a refresh (a timing issue)

(Also click "Show All" to see how to fix "Internal Error 500" if you made an album with Turtle 2.1.7 and hosted on a server not based on Apache)

------------------------------------------------------

Version 2.1.8 Dec 5, 2011

Modified:
- Removed .htaccess file from the skin, because it didn't work with all servers, and possibly could overwrite the user's own, previously added one. Those who experience "Internal Error 500" errors on their server don't need to regenerate the album however, just go into the "Upload / Manage" (Ctrl-M), Connect, click the wrench icon, and remove .htaccess file from the problem folder.

Info: .htaccess file was added in order to define the correct mime types (file handling by type) and to fine tune caching by file type. (E.g. JPG files can remain in the cache for longer times, while HTML files need to skip the cache.)

------------------------------------------------------

Version 2.1.7 Dec 1, 2011

Upgraded:
- jQuery to 1.7.1
- HTML boilerplate to 2.0

Fixed:
- Theme image is now stretched to fit the Title area
- Text color remained black on old Turtle 1.x albums when upgraded to 1.x (you should re-select the Black style to avoid this, but now the skin itself fixes it too)
- No centering on IE7 and 8 when border width was set 0
- Javascript error on IE7 and 8 (in jQuery)

------------------------------------------------------

Version 2.1.6 Oct 29, 2011

Fixed:
- Popups left on by mistake on mobile devices
- Wrong formatted encoded quote characters
- Fixed some validation errors. Now it validates as HTML5 (experimental), besides Meta tags required by Facebook share and Google +1 call code
- Google +1 button did not work in some cases

Updated:
- Italian translation by Giovanni D'Amico

------------------------------------------------------

Version 2.1.5 Oct 25, 2011

New features:
- You can use metadata in Caption templates, e.g. ${Iptc.City}

Fixed:
- Disappearing thumbnail captions when moving the mouse fast
- Memory leak related to thumbnail captions
- Facebook share button works again: Read the announcement in the Turtle forum

------------------------------------------------------

Version 2.1.4 Oct 13, 2011

New features:
- You can use jAlbum variables in the header and footer boxes, e.g. ${resPath}
- Download hint (Right click + Save link as...) added for the "Original" button

Fixed:
- Broken album when using apostrophe character in folder names (with URL encoding turned off)
- <b> <strong> <i> and <em> tags did not take effect in the comments

------------------------------------------------------

Version 2.1.3 Oct 11, 2011

New feature:
- Sharing options on the Info panel too. Please note, that not all sharing sites support links with hash, which is used by Turtle skin to link directly to the actual image. Even though Facebook will link to the actual image, it takes its thumbnail from the static page, that is it will use the Theme image, not the actual.

Fixed:
- Albums with "Link to original" used the high resolution images as thumbnail, resulting in slow page loads
- With transition type "Crossfade" the Zoom-in effect took place while in "Fit to screen" mode, causing slower transitions
- Better reference to album thumbnail that Facebook will like more, hopefully

------------------------------------------------------

Version 2.1.2 Oct 6, 2011

New feature:
- Better touch control on Android devices

Updated:
- Italian translation by Giovanni D'Amico
- Finnish translation by Pentti Stenman
- French translation by Danamel
(The language updates were missing from the bundled version came with jAlbum 10.1, so install this version if you are using the languages above.)

Fixed:
- Background image is centered instead of stretched in FireFox 3.5 & 3.6
- Some styles had texts hard to read

------------------------------------------------------

Version 2.1.1 Sep 30, 2011

New feature:
- You can use formatting characters in the header and footer content, or leave it as is for HTML or Javascript content.
- Header and footer can be disabled on the sub pages

Fixed:
- Header content got lost after viewing it the first time
- Swipe gestures work now on Android devices

------------------------------------------------------

Version 2.1.0 Sep 29, 2011

New features:
- Added transition type: None (for the purists)
- You can add Header and Footer through the user interface
- Added option for displaying the folder description and image count along the folder thumbnails

Fixed:
- Audio loop didn't work
- Map did not work when the image caption template was empty
- Broken cross-fade transition (temporary blackout) on FireFox 5-7, due to a bug in FireFox's rendering engine
- Text color did not work on some places resulting in hard to read texts

Changed:
- The help button has been moved from the theme image area to the footer. No UI option for hiding it, as it's now hidden enough to bother anybody, I hope.

------------------------------------------------------

Version 2.0.4 Sep 27, 2011

New:
- Control for transition type (Cross fade and Cross fade + zoom currently) and speed on the Advanced panel

Fixed:
- The second file of background audio did not play (if added as album file).
- Changed transition step interval on touch devices for a smoother transition

Updated:
- French translation by Eyael

------------------------------------------------------

Version 2.0.3 Sep 26, 2011

Fixed:
- In Black style the folder info was barely visible

Updated:
- French translation

------------------------------------------------------

Version 2.0.2

New feature:
- You can skip the little help [?] button on the start page
- French translation is updated thanks to Daniel Cloude

Fixed:
- Double count in album images
- No translation for the "Start slideshow" text
- Home and End button on keyboards with no dedicated Home and End buttons (NumPad)

Changed:
- ZoomIn effect between slides is disabled on touch devices for a bit smoother transition

------------------------------------------------------

Version 2.0.1

New feature:
- You can choose to hide the album description and show only on mouse over the album title (like 1.x)
- Added "Legacy Black" and "Legacy White" styles to mimic Turtle 1.x look

Fixed:
- IE7 thumbnail page look is fixed
- IE7-8 the start button is repaired

------------------------------------------------------

Version 2.0.0

- Support for touch interface
- Based on HTML5 / CSS3
- The thumbnail page can be both horizontally or verticaly split between the thumbnails and the theme image. Use portrait sized boundary to see.
- Google +1, Tumblr, Reddit sharing option added
- Background audio can be added through the Settings window too.
- Google Checkout Shopping cart is implemented besides Paypal (no overall handling is available yet)


UPGRADING FROM TURTLE 1.x ALBUM PROJECTS

Using Black or White stlyes, please re-select the style (not the skin), to allow the new background and text color settings be set. Without this you might end up in unreadable text.

You can also opt for the "Legacy" styles which were made to mimic the old (v 1.x) styles.

The following settings need attention when opening old projects, because they will be reset to their default values (in parentheses):

- Splash size (Image width x Image height * 0.66)
- Reduce Thumbs (2 / 3)
- Facebook Like button (no)
- Show photo data (no)

These changes were necessary because the skin's code has been rewritten to work with other upcoming skins.

Splash image is now referred as Theme image. You can select it by Right-click -> Use as folder image option.

The Location and Shop option data added manually in the Edit mode has changed names too, but you can apply the Tools / External Tools / Rename Slide Variables tool with the following parameters to keep them working in the new version: 
- _location = location
- _shopOptions = shopOptions

This change was necessary because jAlbum app has changed its handling of slide variables.

Besides the above changes the BlackBlue and BlackRed styles were removed, though tons of new styles were added at the same time.

The Shopping cart feature is only available for Premium or Power account holders and those who've bough the Pro license. Jalbum.net's past donators will also receive the Pro licence.


LICENSE

Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 
<http://creativecommons.org/licenses/by-nc-sa/3.0/>

You are free:
- to Share - to copy, distribute and transmit the work
- to Remix - to adapt the work

Under the following conditions:
- Attribution - You must attribute the work in the manner specified by the author or licensor (but not in any way that suggests that they endorse you or your use of the work).
- Noncommercial - You may not use this work for commercial purposes.
- Share Alike - If you alter, transform, or build upon this work, you may distribute the resulting work only under the same or similar license to this one.

With the understanding that:
- Waiver - Any of the above conditions can be waived if you get permission from the copyright holder.
- Public Domain - Where the work or any of its elements is in the public domain under applicable law, that status is in no way affected by the license.
- Other Rights - In no way are any of the following rights affected by the license:
   Your fair dealing or fair use rights, or other applicable copyright exceptions and limitations;
   The author's moral rights;
   Rights other persons may have either in the work itself or in how the work is used, such as publicity or privacy rights.


VIDEO PLAYER COMPONENT

LongtailVideo Flash Video Player licensing:

The player is licensed under a Creative Commons License: 
http://creativecommons.org/licenses/by-nc-sa/3.0/
It allows you to use, modify and redistribute the script, 
but only for noncommercial purposes. 

Examples of commercial use include:
	* websites with any advertisements;
	* websites owned or operated by corporations;
	* websites designed to promote other products, such as a band or artist;
	* products (e.g. a CMS) that bundle LongTail products into its offering.

If any of the above conditions apply to you, please apply for a commercial 
license now: http://www.longtailvideo.com/players/order

If you are still unsure whether you need to purchase a license, 
please post your question in the forum:
http://www.longtailvideo.com/forum/


FREE ASSETS

- High quality texture backgrounds from <http://www.webtexture.net/>
- Modernizr <http://www.modernizr.com/>
- HTML5 Boilerplate <http://html5boilerplate.com/>
- jQuery javascript library <http://jquery.com/>
- Google Maps API 3.0
- Google +1 API
- Google Analytics
- Paypal Web Standards Payment API
- Google Checkout API
- Java Development Kit 1.6
- jQuery Easing functions by George Smith
- jQuery history plugin by Taku Sano (Mikage Sawatari) & Takayuki Miwa <http://tkyk.github.com/jquery-history-plugin/>


Enjoy Turtle skin,

Laza
laza@jalbum.net
