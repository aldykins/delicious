delicious
=========

Delicious chocolate-flavoured stylesheets: Dream, Milky Way, Toblerone. Itadakimasu.

### ahhhh what does all this mean

style.scss is the main framework of the stylesheets. This is to ensure there is consistency across the stylesheets and any bug fixes, suggestion implementations etc will apply across all of them. This also makes it easier to do future variations because all you essentially need to do is choose colours.

Customisations between the different stylesheets are then controlled by [Sass variables](http://sass-lang.com/). Each respective stylesheet's variables are located in their respective txt file. These variables can then be put at the top of style.scss, from which the resultant stylesheet can be compiled.

If you've never used Sass before, try [Koala](http://koala-app.com/) which is an incredibly simple GUI application for it. You just need to add your working directory, set the scss file to auto compile with a compressed output, and then leave it running in the background. Sass is quite extensive but because i r css newb, I'm just using variables for now which are pretty self-explanatory.