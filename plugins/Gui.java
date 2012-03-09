import java.io.*;
import java.awt.*;
import java.awt.Color;
import java.awt.SystemColor;
import java.awt.event.*;
import javax.swing.*;

import se.datadosen.util.Item;
import se.datadosen.util.IO;
import se.datadosen.component.*;
import se.datadosen.jalbum.JCustomPanel;
import se.datadosen.jalbum.JAlbumContext;
import se.datadosen.jalbum.PluginContext;
import se.datadosen.jalbum.EditPanel;
import se.datadosen.jalbum.JAlbumWindow;
import se.datadosen.jalbum.SkinProperties;
import se.datadosen.jalbum.event.*;
import se.datadosen.jalbum.AccountManager;
import se.datadosen.jalbum.SignInManager;
import se.datadosen.jalbum.JAlbumSite;

import edu.stanford.ejalbert.BrowserLauncher;

public class Gui extends se.datadosen.jalbum.CompiledScript {

	private Color getHighlightedColor(String s) {
		long[] rgb = {Integer.parseInt(s.substring(1, 3), 16), Integer.parseInt(s.substring(3, 5), 16), Integer.parseInt(s.substring(5, 7), 16)};
		int i;
		if (((double) (3 * rgb[0] + 4 * rgb[1] + rgb[2]) / 2040) < 0.85D) {
			for (i = 0; i < 3; i++) {
				if (rgb[i] < 128) {
					rgb[i] = Math.round(127 * Math.pow(((double) rgb[i]) / 127.0D, 2.0D));
				} else {
					rgb[i] = Math.round(255 - 127 * Math.pow(((double) (255 - rgb[i])) / 127.0D, 2.0D));
				}
				rgb[i] = Math.round(Math.floor(127 + rgb[i] * 0.5D));
			}
		} else {
			for (i = 0; i < 3; i++) {
				rgb[i] = Math.round((double) rgb[i] * 0.8D);
			}
		}
		return new Color((int) rgb[0], (int) rgb[1], (int) rgb[2]);
	}
	
	private ImageIcon createImageIcon(String path) {
		java.net.URL imgURL = getClass().getResource(path);
		if (imgURL != null) {
			return new ImageIcon(imgURL, path);
		} else {
			System.out.println("Couldn't find file: " + path);
			return null;
		}
	}
	
	private String attemptSignIn() {
		SignInManager mgr = SignInManager.getInstance();
		if ( mgr != null && mgr.isSignedIn() ) {
			return "&cid=" + AccountManager.getCid(mgr.getUserName(), mgr.getPassword());
		}
		return "";
	}
	
	private String getLicense() {
		SignInManager mgr = SignInManager.getInstance();
		return ( mgr != null && mgr.isLicenseValid() )? mgr.getUserName() : "";
	}
	
	private String license = getLicense();
	
	private String getFileContents(String name) {
		StringBuilder cont = new StringBuilder();
		String line;
		String nl = System.getProperty("line.separator");
		File f = new File(skinDirectory, name);
		try {
			java.io.BufferedReader in =  new java.io.BufferedReader(new java.io.FileReader(f));
			try {
				while ((line = in.readLine()) != null) {
					cont.append(line);
					cont.append(nl);
				}
			}
			finally {
				in.close();
			}
		} catch (FileNotFoundException e) {
			return null;
		} catch (IOException e) {
			return null;
		}
		return cont.toString();
	}
	
	JTextArea readme = new JSmartTextArea( getFileContents("readme.txt"), 20, 40 );
	
	{
		readme.setLineWrap(true);
		readme.setWrapStyleWord(true);
		readme.setEditable(false);
	}
	
	JScrollPane aboutPanel = new JScrollPane(readme, JScrollPane.VERTICAL_SCROLLBAR_ALWAYS, JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
    
	private JFileChooser fc = new JFileChooser();
	private JFileFilter imgFilter = new JFileFilter(new String[] {"jpg", "png", "gif"}, "Images");
	
	private void getFileToRes(String[] ext, JTextField name) {
		getFileToRes(new JFileFilter(ext, "allowed files"), name);
	}
	
	private void getFileToRes(JFileFilter filter, JTextField name) {
		fc.setFileFilter(filter);
		int returnVal = fc.showOpenDialog(window);
		if (returnVal == JFileChooser.APPROVE_OPTION) {
			String fn = fc.getSelectedFile().toString();
			if ( !fn.trim().equals("") ) {
				File src = new File(fn);
				File dst = new File(engine.getDirectory(), "res");
				if (!dst.exists()) {
					dst.mkdir();
				}
				if (src.exists() &&  dst.exists()) {
					try {
						IO.copyFile(src, dst);
						name.setText( src.getName() );
					} catch (IOException e) {
						System.out.println(e);
					}
				}
			}
		}
	}
	
	StateMonitor commercialMonitor = new StateMonitor() {
		public void onChange() {
			if ( ((JCheckBox)source).isSelected() && license.length() == 0 ) {
				Object[] options = { 
					texts.getString("ui.signUp"),
					texts.getString("ui.noThanks")
				};
				int n = JOptionPane.showOptionDialog(window, 
					texts.getString("ui.licenseWarning"), 
					texts.getString("ui.licenseWarningTitle"), 
					JOptionPane.YES_NO_OPTION, 
					JOptionPane.INFORMATION_MESSAGE,
					null,
					options,
					options[1]
				);
				if (n == 0) {
					try {
						BrowserLauncher.openURL(JAlbumSite.getTrueInstance().getMyJAlbumUpgradeUrl() + "/?referrer=" + skin + attemptSignIn());
					} catch (se.datadosen.tags.ElementException x) {
					} catch (IOException x) {
					}
				}
				((JCheckBox)source).setSelected(false);
			}
		}
	};

	ControlPanel ui = new ControlPanel() {

		JCheckBox guiExists = new JCheckBox("", true);
		
		JLabel formattingHint1h = new JLabel(texts.getString("ui.formattingHint1"));
		JLabel formattingHint2h = new JLabel(texts.getString("ui.formattingHint2"));
		JLabel formattingHint1f = new JLabel(texts.getString("ui.formattingHint1"));
		JLabel formattingHint2f = new JLabel(texts.getString("ui.formattingHint2"));
		
		ControlPanel general = new ControlPanel() {

			JCheckBox skipThumbnailPage = new JCheckBox(texts.getString("ui.skipThumbnailPage"));
			JTextField slideshowDelay = new JSmartTextField("4", 3);
			JCheckBox slideshowLoop = new JCheckBox(texts.getString("ui.loop"));
			JCheckBox slideshowAuto = new JCheckBox(texts.getString("ui.autoStart"));
			JTextField newDaysCount = new JSmartTextField("0", 3);
			JComboBox afterLast = new JComboBox(new Object[] {
				new Item("donothing", texts.getString("ui.doNothing")), 
				new Item("startover", texts.getString("startOver")),
				new Item("onelevelup", texts.getString("upOneLevel")),
				new Item("backtoindex", texts.getString("backToIndex")),
				new Item("ask", texts.getString("ui.ask"))
			});
			JCheckBox preFormat = new JCheckBox(texts.getString("ui.preFormatPages"), true);

			ControlPanel defaults = new ControlPanel(texts.getString("ui.defaults")) {
				
				JCheckBox descriptionVisible = new JCheckBox(texts.getString("ui.descriptionVisible"), true);
				JCheckBox thumbnailsVisible = new JCheckBox(texts.getString("ui.thumbnailsVisible"));
				JCheckBox infoPanelVisible = new JCheckBox(texts.getString("ui.infoPanelVisible"));
				JCheckBox fitImages = new JCheckBox(texts.getString("ui.fitImages"));
				JCheckBox fitShrinkonly = new JCheckBox(texts.getString("ui.fitShrinkonly"));
				
				{
					descriptionVisible.setToolTipText(texts.getString("ui.descriptionVisibleInfo"));
					thumbnailsVisible.setToolTipText(texts.getString("ui.thumbnailsVisibleInfo"));
					infoPanelVisible.setToolTipText(texts.getString("ui.infoPanelVisibleInfo"));
					fitImages.setToolTipText(texts.getString("ui.fitImagesInfo"));
					fitShrinkonly.setToolTipText(texts.getString("ui.fitShrinkonlyInfo"));
					ComponentUtilities.whenSelectedEnable(fitImages, new JComponent[]{fitShrinkonly});
					
					add(descriptionVisible);
					add("br", thumbnailsVisible);
					add("br", infoPanelVisible);
					add("br", fitImages);
					add(" ", fitShrinkonly);
				}
			};
			
			{
				skipThumbnailPage.setToolTipText(texts.getString("ui.skipThumbnailPageInfo"));
				slideshowDelay.setToolTipText(texts.getString("ui.slideshowDelayInfo"));
				newDaysCount.setToolTipText(texts.getString("ui.newDaysCountInfo"));
				afterLast.setToolTipText(texts.getString("ui.afterLastInfo"));
				afterLast.setSelectedIndex(4);
				preFormat.setToolTipText(texts.getString("ui.preFormatPagesInfo"));
				ComponentUtilities.whenSelectedEnable(preFormat, new JComponent[]{formattingHint1h, formattingHint2h, formattingHint1f, formattingHint2f});

				add("", skipThumbnailPage);
				add("br", new JLabel(texts.getString("ui.slideshowDelay")));
				add("", slideshowDelay);
				add(" ", slideshowLoop);
				add(" ", slideshowAuto);
				add("br", new JLabel(texts.getString("ui.markFilesNew")));
				add("", newDaysCount);
				add("", new JLabel(texts.getString("ui.daysOld")));
				add("br", new JLabel(texts.getString("ui.afterLast")));
				add("tab", afterLast);
				add("br hfill", defaults);
				add("br", preFormat);
			}
		};
			
		ControlPanel header = new ControlPanel() {
			
			JCheckBox showTopNavigation = new JCheckBox(texts.getString("ui.showTopNavigation"), true);	
			JTextField logoName = new JSmartTextField(30);
			JButton selectLogo = new JButton(texts.getString("ui.select"));
			JCheckBox useUplink = new JCheckBox(texts.getString("ui.useUplink"), false);
			JTextField uplinkUrl = new JSmartTextField("../", 10);
			JTextField folderImageSize = new JSmartTextField(10);
			Integer folderImageWidth = Integer.parseInt(engine.getImageSize().split("x")[0]);
			Integer folderImageHeight = Integer.parseInt(engine.getImageSize().split("x")[1]) / 2;
			JCheckBox useSearch = new JCheckBox(texts.getString("ui.useSearchBox"));
			// JCheckBox displayHelpButton = new JCheckBox(texts.getString("ui.displayHelpButton"), true);
			JCheckBox headerTopLevelOnly = new JCheckBox(texts.getString("ui.topLevelOnly"), true);
			JTextArea header = new JSmartTextArea(6, 40);
			JScrollPane headerPane = new JScrollPane(header);
			
			{
				showTopNavigation.setToolTipText(texts.getString("ui.showTopNavigationInfo"));
				selectLogo.addActionListener(new ActionListener() { 
					public void actionPerformed(ActionEvent e) {
						getFileToRes(imgFilter, logoName);
				}});
				ComponentUtilities.whenSelectedEnable(showTopNavigation, new JComponent[]{logoName, selectLogo});
				useUplink.setToolTipText(texts.getString("ui.useUplinkInfo"));
				uplinkUrl.setToolTipText(texts.getString("ui.useUplinkInfo"));
				ComponentUtilities.whenSelectedEnable(useUplink, new JComponent[]{uplinkUrl});
				folderImageSize.setText(folderImageWidth.toString() + "x" + folderImageHeight.toString());
				folderImageSize.setToolTipText(texts.getString("ui.folderImageSizeInfo"));
				useSearch.setToolTipText(texts.getString("ui.useSearchBoxInfo"));
				// displayHelpButton.setToolTipText(texts.getString("ui.displayHelpButtonInfo"));
				header.setEditable(true);
				header.setLineWrap(true);
				header.setWrapStyleWord(true);
				header.setToolTipText(texts.getString("ui.customContentInfo"));
				
				add("", showTopNavigation);
				add("br", new JLabelFor(texts.getString("ui.logo"), logoName));
				add("hfill", logoName);
				add("", selectLogo);
				add("br", useUplink);
				add("hfill", uplinkUrl);
				add("br", new JLabel(texts.getString("ui.folderImageSize")));
				add("", folderImageSize);
				add("br", useSearch);
				// add("br", displayHelpButton);
				add("br", new JLabel(texts.getString("ui.albumInfo")));
				add("tab", headerTopLevelOnly);
				add("br hfill", headerPane);
				add("br", formattingHint1h);
				add("br", formattingHint2h);
			}
		};
		
		ControlPanel footer = new ControlPanel() {
			
			JCheckBox showImageCount = new JCheckBox(texts.getString("ui.showFolderImageCount"), true);	
			JCheckBox showBottomNavigation = new JCheckBox(texts.getString("ui.showBottomNavigation"), false);	
			JTextField customLink = new JSmartTextField();
			JTextField customLinkText = new JSmartTextField();
			JCheckBox showHelp = new JCheckBox(texts.getString("ui.displayHelpButton"), true);	
			JCheckBox footerTopLevelOnly = new JCheckBox(texts.getString("ui.topLevelOnly"), false);
			JTextArea footer = new JSmartTextArea(6, 40);
			JScrollPane footerPane = new JScrollPane(footer);
			
			{
				showImageCount.setToolTipText(texts.getString("ui.showFolderImageCountInfo"));
				showBottomNavigation.setToolTipText(texts.getString("ui.showBottomNavigationInfo"));
				customLink.setToolTipText(texts.getString("ui.customLinkInfo"));
				customLinkText.setToolTipText(texts.getString("ui.customLinkTextInfo"));
				showHelp.setToolTipText(texts.getString("ui.displayHelpButtonInfo"));
				footer.setEditable(true);
				footer.setLineWrap(true);
				footer.setWrapStyleWord(true);
				footer.setToolTipText(texts.getString("ui.customContentInfo"));

				add("", showImageCount);
				add("br", showBottomNavigation);
				add("br", new JLabel(texts.getString("ui.customLink")));
				add("tab hfill", customLink);
				add("br", new JLabel(texts.getString("ui.customLinkText")));
				add("tab hfill", customLinkText);
				add("br", showHelp);
				add("br", new JLabel(texts.getString("ui.customContent")));
				add("tab", footerTopLevelOnly);
				add("br hfill", footerPane);
				add("br", formattingHint1f);
				add("br", formattingHint2f);
			}
		};

		ControlPanel design = new ControlPanel() {

			JComboBox fontFamily = new JComboBox(new Object[] {
				"Arial,Helvetica,sans-serif", 
				"\"Segoe UI\",Arial,\"Nimbus Sans L\",sans-serif", 
				"Verdana,Geneva,sans-serif", 
				"\"Lucida Sans Unicode\",\"Lucida Grande\",sans-serif",
				"Georgia,\"Times New Roman\",serif", 
				"\"Trebuchet MS\",Verdana,sans-serif",
				"\"Times New Roman\",Times,serif", 
				"\"Courier New\",Courier,monospaced",
				"Tahoma,Geneva,sans-serif", 
				"\"Comic Sans MS\",cursive"
			});
			JTextField backgroundImageName = new JSmartTextField(20);
			JButton selectImage = new JButton();
			JComboBox backgroundPos = new JComboBox(new Object[] {
				new Item("left top", texts.getString("ui.bg_left_top")), 
				new Item("center top", texts.getString("ui.bg_center_top")), 
				new Item("right top", texts.getString("ui.bg_right_top")), 
				new Item("left middle", texts.getString("ui.bg_left_middle")), 
				new Item("center middle", texts.getString("ui.bg_center_middle")), 
				new Item("right middle", texts.getString("ui.bg_right_middle")), 
				new Item("left bottom", texts.getString("ui.bg_left_bottom")), 
				new Item("center bottom", texts.getString("ui.bg_center_bottom")), 
				new Item("right bottom", texts.getString("ui.bg_right_bottom"))
			});
			JComboBox backgroundRepeat = new JComboBox(new Object[] {
				new Item("no-repeat", texts.getString("ui.bg_no_repeat")),
				new Item("repeat-x", texts.getString("ui.bg_repeat_x")),
				new Item("repeat-y", texts.getString("ui.bg_repeat_y")),
				new Item("repeat", texts.getString("ui.bg_repeat_both")),
				new Item("stretch", texts.getString("ui.bg_stretch")),
			});
			JCheckBox use3dEffects = new JCheckBox(texts.getString("ui.use3dEffects"), true);
			JCheckBox stickControlsToTop = new JCheckBox(texts.getString("ui.stickControlsToTop"));
			
			ControlPanel colors = new ControlPanel(texts.getString("ui.colors")) {
				
				JColorSelector backgroundColor = new JColorSelector(texts.getString("ui.backgroundColor"), new JSmartTextField(6));
				JColorSelector textColor = new JColorSelector(texts.getString("ui.textColor"), new JSmartTextField(6));
				JColorSelector highlightColor = new JColorSelector(); // Hidden, automatically assigned
				JColorSelector linkColor = new JColorSelector(texts.getString("ui.linkColor"), new JSmartTextField(6));
				JColorSelector hoverColor = new JColorSelector(texts.getString("ui.hoverColor"), new JSmartTextField(6));
				JColorSelector borderColor = new JColorSelector(texts.getString("ui.borderColor"), new JSmartTextField(6));
				JSpinner borderWidth = new JSpinner(new SpinnerNumberModel(10, 0, 100, 1));
				
				{
					backgroundColor.setToolTipText(texts.getString("ui.backgroundColorInfo"));
					textColor.setToolTipText(texts.getString("ui.textColorInfo"));
					linkColor.setToolTipText(texts.getString("ui.linkColorInfo"));
					hoverColor.setToolTipText(texts.getString("ui.hoverColorInfo"));
					borderColor.setToolTipText(texts.getString("ui.borderColorInfo"));
					textColor.addActionListener(new ActionListener() {
						public void actionPerformed(ActionEvent e) {
							highlightColor.setColor(getHighlightedColor(textColor.getHTMLColor()));
						}
					});
					linkColor.addActionListener(new ActionListener() {
						public void actionPerformed(ActionEvent e) {
							hoverColor.setColor(getHighlightedColor(linkColor.getHTMLColor()));
						}
					});
					
					add("", new JLabelFor(texts.getString("ui.backgroundColor"), backgroundColor));
					add("tab", backgroundColor);
					add("tab", backgroundColor.getTextComponent());
					add("tab", new JLabelFor(texts.getString("ui.textColor"), textColor));
					add("tab", textColor);
					add("tab", textColor.getTextComponent());
					add("br", new JLabelFor(texts.getString("ui.linkColor"), linkColor));
					add("tab", linkColor);
					add("tab", linkColor.getTextComponent());
					add("tab", new JLabelFor(texts.getString("ui.hoverColor"), hoverColor));
					add("tab", hoverColor);
					add("tab", hoverColor.getTextComponent());
					add("br", new JLabelFor(texts.getString("ui.borderColor"), borderColor));
					add("tab", borderColor);
					add("tab", borderColor.getTextComponent());
					add("tab", new JLabelFor(texts.getString("ui.borderWidth"), borderWidth));
					add("", borderWidth);
					add("", new JLabel("px"));
				}
			};
			
			
			ControlPanel thumbnails = new ControlPanel(texts.getString("ui.thumbnails")) {
				
				JCheckBox fixedShapeThumbs = new JCheckBox(texts.getString("ui.fixedShapeThumbs"), true);
				JTextField preZoomThumbs = new JSmartTextField("0", 3);
				JComboBox reduceThumbs = new JComboBox(new Object[] {
					new Item("1.0", "1 / 1"), 
					new Item("0.75", "3 / 4"), 
					new Item("0.66666667", "2 / 3"), 
					new Item("0.5", "1 / 2"), 
					new Item("0.33333333", "1 / 3"), 
					new Item("0.25", "1 / 4") 
				});
				
				{
					fixedShapeThumbs.setToolTipText(texts.getString("ui.fixedShapeThumbsInfo"));
					ComponentUtilities.whenSelectedEnable(fixedShapeThumbs, new JComponent[]{preZoomThumbs});
					preZoomThumbs.setToolTipText(texts.getString("ui.preZoomThumbsInfo"));
					reduceThumbs.setSelectedIndex(2);
					
					add(fixedShapeThumbs);
					add("tab", new JLabel(texts.getString("ui.preZoomThumbs") + " 100+"));
					add("", preZoomThumbs);
					add("", new JLabel("%"));
					add("br", new JLabel(texts.getString("ui.reduceThumbs")));
					add("tab", reduceThumbs);
					
				}
			};

			{
				backgroundImageName.setToolTipText(texts.getString("ui.backgroundImageInfo"));
				selectImage.setText(texts.getString("ui.select"));
				selectImage.addActionListener(new ActionListener() { 
					public void actionPerformed(ActionEvent e) {
						getFileToRes(imgFilter, backgroundImageName);
				}});
				backgroundPos.setSelectedIndex(4);
				backgroundRepeat.setSelectedIndex(4);
				use3dEffects.setToolTipText(texts.getString("ui.use3dEffectsInfo"));
				stickControlsToTop.setToolTipText(texts.getString("ui.stickControlsToTopInfo"));
				
				add(new JLabel(texts.getString("ui.fontFamily")));
				add("", fontFamily);
				add("br", new JLabelFor(texts.getString("ui.backgroundImage"), backgroundImageName));
				add("tab", backgroundImageName);
				add("", selectImage);
				add("br tab", backgroundPos);
				add("", backgroundRepeat);
				add("br", use3dEffects);
				add("tab", stickControlsToTop);
				add("br hfill", colors);
				add("br hfill", thumbnails);
			}
		};
		
		ControlPanel caption = new ControlPanel() {
			
			ControlPanel images = new ControlPanel(texts.getString("ui.images")) {

				JCheckBox showImageNumbers = new JCheckBox(texts.getString("ui.showImageNumbers"), true);
				JTextArea imgCaptionTemplate = new JSmartTextArea(4, 40);
				JScrollPane iCaptionPane = new JScrollPane(imgCaptionTemplate);
				
				{
					showImageNumbers.setToolTipText(texts.getString("ui.showImageNumbersInfo"));
					imgCaptionTemplate.setText("<h2>${fileLabel}</h2><div class=\"comment\">${comment}</div>");
					imgCaptionTemplate.setEditable(true);
					imgCaptionTemplate.setLineWrap(true);
					imgCaptionTemplate.setWrapStyleWord(true);
					
					add(showImageNumbers);
					add("br hfill", iCaptionPane);
				}
			};
			
			ControlPanel thumbnails = new ControlPanel(texts.getString("ui.thumbnails")) {
			
				JTextArea thumbCaptionTemplate = new JSmartTextArea(4, 40);
				JScrollPane tCaptionPane = new JScrollPane(thumbCaptionTemplate);
				JComboBox captionPlacement = new JComboBox(new Object[] {
					new Item("tooltip", texts.getString("ui.tooltip")), 
					new Item("below", texts.getString("ui.below"))
				});
				
				{
					thumbCaptionTemplate.setText("<span class=\"nr\">${imageNum}</span> <strong>${fileTitle}</strong> <small>${comment}</small>");
					thumbCaptionTemplate.setEditable(true);
					thumbCaptionTemplate.setLineWrap(true);
					thumbCaptionTemplate.setWrapStyleWord(true);
					
					add(new JLabel(texts.getString("ui.placeThumbCaptions")));
					add(captionPlacement);
					add("br hfill", tCaptionPane);
				}
			};
			
			ControlPanel folders = new ControlPanel(texts.getString("ui.folders")) {
				
				JCheckBox showFolderDescription = new JCheckBox(texts.getString("ui.showFolderDescription"), true);
				JCheckBox showFolderImageCount = new JCheckBox(texts.getString("ui.showFolderImageCount"), true);
				
				{
					add(showFolderDescription);
					add("tab", showFolderImageCount);
				}
			};
			
			{
				add("hfill", images);
				add("br hfill", thumbnails);
				add("br hfill", folders);
			}
		};
		

		
		ControlPanel share = new ControlPanel() {

			ControlPanel buttons = new ControlPanel(texts.getString("ui.buttons")) {
				JCheckBox facebookLike = new JCheckBox(texts.getString("ui.facebookLikeButton"));
				JCheckBox twitterTweet = new JCheckBox(texts.getString("ui.tweetButton"));
				JCheckBox googlePlus = new JCheckBox(texts.getString("ui.googlePlus"));
				JCheckBox tumblrButton = new JCheckBox(texts.getString("ui.tumblrButton"));
				
				{
					facebookLike.setToolTipText(texts.getString("ui.facebookLikeButtonInfo"));
					twitterTweet.setToolTipText(texts.getString("ui.tweetButtonInfo"));
					googlePlus.setToolTipText(texts.getString("ui.googlePlusInfo"));
					tumblrButton.setToolTipText(texts.getString("ui.tumblrButtonInfo"));
					
					add(facebookLike);
					add("tab", twitterTweet);
					add("br", googlePlus);
					add("tab", tumblrButton);
				}
			};
			
			ControlPanel shares = new ControlPanel(texts.getString("shareOn")) {
				
				JCheckBox shareFacebook = new JCheckBox("Facebook");
				JCheckBox shareTwitter = new JCheckBox("Twitter");
				JCheckBox shareDigg = new JCheckBox("Digg");
				JCheckBox shareDelicious = new JCheckBox("Delicious");
				JCheckBox shareMyspace = new JCheckBox("MySpace");
				JCheckBox shareStumbleupon = new JCheckBox("StumbleUpon");
				JCheckBox shareReddit = new JCheckBox("Reddit");
				JCheckBox shareEmail = new JCheckBox("Email");
				
				{
					add(shareFacebook);
					add("tab", shareTwitter);
					add("tab", shareDigg);
					add("tab", shareDelicious);
					add("br", shareMyspace);
					add("tab", shareStumbleupon);
					add("tab", shareReddit);
					add("tab", shareEmail);
				}
			};

			{
				add("hfill", buttons);
				add("br hfill", shares);
			}
		};
		
		ControlPanel photoData = new ControlPanel() {

			JCheckBox showPhotoData = new JCheckBox(texts.getString("ui.showPhotoData"));
			JCheckBox showPhotoDataLabel = new JCheckBox(texts.getString("ui.showLabel"), true);
			JTextArea photoDataTemplate = new JSmartTextArea(12, 40);
			JScrollPane photoDataPane = new JScrollPane(photoDataTemplate);

			{
				showPhotoData.setToolTipText(texts.getString("ui.showPhotoDataInfo"));
				showPhotoDataLabel.setToolTipText(texts.getString("ui.showLabelInfo"));
				photoDataTemplate.setText("photographer|artist|Artist|Owner|Copyright|Iptc.By-line|Iptc.Copyright Notice, Xmp.Creator, Xmp.Title, objectName, Xmp.Subject, Xmp.Description, Iptc.keywords, Xmp.Format, Xmp.Rights, Xmp.Identifier, Xmp.Label, Country/Primary Location, Province/State, City, Sub-location, originalDate|Date/Time Original|Date/Time|CreateDate|ModifyDate, camera|Model, lens|Lens|Xmp.Lens-Information|Canon Makernote.Unknown tag (0x0095), focalLength35mm|focusDistance|Focal Length|Focallength, SubjectDistance, meteringMode|Metering Mode, isoEquivalent|ISO Speed Ratings, exposureTime|Exposure Time|Shutter Speed Value|ShutterSpeedValue, Aperture Value|aperture|F-Number|FNumber|Aperturevalue, Exposure Bias Value, Exposure Program|Exposureprogram|Exposure Mode, Xmp.SceneType, White Balance|WhiteBalance, Xmp.ColorSpace, Xmp.LightSource, flash|Flash, resolution");
				photoDataTemplate.setEditable(true);
				photoDataTemplate.setLineWrap(true);
				photoDataTemplate.setWrapStyleWord(true);

				ComponentUtilities.whenSelectedEnable(showPhotoData, new JComponent[]{showPhotoDataLabel, photoDataTemplate});
				add(showPhotoData);
				add("tab", showPhotoDataLabel);
				add("br hfill vfill", photoDataPane);
			}
		};
		
		ControlPanel map = new ControlPanel() {

			JCheckBox showMap = new JCheckBox(texts.getString("ui.showMap"));
			JComboBox mapType = new JComboBox(new Object[]{
				new Item("roadmap", texts.getString("ui.roadmap")),
				new Item("satellite", texts.getString("ui.satellite")),
				new Item("hybrid", texts.getString("ui.hybrid")),
				new Item("terrain", texts.getString("ui.terrain"))
			});
			JSlider mapZoom = new JSlider(JSlider.HORIZONTAL, 1, 20, 18);
			JCheckBox mapAll = new JCheckBox(texts.getString("ui.allMarkers"));

			{
				showMap.setToolTipText(texts.getString("ui.showMapInfo"));
				mapAll.setToolTipText(texts.getString("ui.allMarkersInfo"));
				mapZoom.setOrientation(JSlider.HORIZONTAL);
				mapZoom.setMinimum(0);
				mapZoom.setMaximum(20);
				mapZoom.setValue(18);
				mapZoom.setMajorTickSpacing(10);
				mapZoom.setMinorTickSpacing(1);
				mapZoom.setPaintTicks(true);
				mapZoom.setPaintLabels(true);
				mapZoom.setSnapToTicks(true);

				ComponentUtilities.whenSelectedEnable(showMap, new JComponent[]{ mapAll, mapType, mapZoom });
				add(showMap);
				add("", mapAll);
				add("br", new JLabelFor(texts.getString("ui.initialView"), mapType));
				add("tab", mapType);
				add("br", new JLabelFor(texts.getString("ui.initialZoom"), mapZoom));
				add("tab", mapZoom);
			}
		};
		
		ControlPanel shop = new ControlPanel() {

			JCheckBox showShop = new JCheckBox(texts.getString("ui.sellPhotos"));
			JComboBox shopGateway = new JComboBox(new Object[]{
				new Item("paypal", "PayPal Website Standards Payment"),
				new Item("google", "Google Checkout") /*,
				new Item("amazon", "Checkout by Amazon")*/
			});
			JTextField shopId = new JTextField(10);
			JComboBox shopCurrency = new JComboBox(new Object[]{ 
				new Item("USD", "United States Dollars"),
				new Item("EUR", "Euro"),
				new Item("GBP", "United Kingdom Pounds"),
				new Item("CAD", "Canada Dollars"),
				new Item("AUD", "Australia Dollars"),
				new Item("RUB", "Russia Rubles"),
				new Item("JPY", "Japan Yen"),
				new Item("INR", "India Rupees"),
				new Item("NZD", "New Zealand Dollars"),
				new Item("CHF", "Switzerland Francs"),
				new Item("ARS", "Argentina Pesos"),
				new Item("BHD", "Bahrain Dinars"),
				new Item("BYR", "Belarus Rubles"),
				new Item("BAM", "Bosnia & Herzegovina C.Marka"),
				new Item("BRL", "Brazil Reais"),
				new Item("BGN", "Bulgaria Leva"),
				new Item("CLP", "Chile Pesos"),
				new Item("CNY", "China Yuan Renminbi"),
				new Item("COP", "Colombia Pesos"),
				new Item("CRC", "Costa Rica Colones"),
				new Item("HRK", "Croatia Kuna"),
				new Item("CZK", "Czech Republic Koruny"),
				new Item("DKK", "Denmark Kroner"),
				new Item("EGP", "Egypt Pounds"),
				new Item("EEK", "Estonia Krooni"),
				new Item("GTQ", "Guatemala Quetzales"),
				new Item("HKD", "Hong Kong Dollars"),
				new Item("HUF", "Hungary Forint"),
				new Item("ISK", "Iceland Kronur"),
				new Item("IDR", "Indonesia Rupiahs"),
				new Item("IQD", "Iraq Dinars"),
				new Item("ILS", "Israel New Shekels"),
				new Item("JMD", "Jamaica Dollars"),
				new Item("JOD", "Jordan Dinars"),
				new Item("KWD", "Kuwait Dinars"),
				new Item("LVL", "Latvia Lati"),
				new Item("LBP", "Lebanon Pounds"),
				new Item("LTL", "Lithuania Litai"),
				new Item("MKD", "Macedonia Denars"),
				new Item("MXN", "Mexico Pesos"),
				new Item("MDL", "Moldova Lei"),
				new Item("MAD", "Morocco Dirhams"),
				new Item("NOK", "Norway Kroner"),
				new Item("PEN", "Peru Nuevos Soles"),
				new Item("PHP", "Philippines Pesos"),
				new Item("PLN", "Poland Zlotych"),
				new Item("RON", "Romania New Lei"),
				new Item("SAR", "Saudi Arabia Riyals"),
				new Item("RSD", "Serbia Dinars"),
				new Item("SGD", "Singapore Dollars"),
				new Item("ZAR", "South Africa Rand"),
				new Item("KRW", "South Korea Won"),
				new Item("SEK", "Sweden Kronor"),
				new Item("TWD", "Taiwan New Dollars"),
				new Item("THB", "Thailand Baht"),
				new Item("TRY", "Turkey Lira"),
				new Item("UAH", "Ukraine Hryvnia"),
				new Item("AED", "United Arab Emirates Dirhams"),
				new Item("UYU", "Uruguay Pesos"),
				new Item("VND", "Vietnam Dong")
			});
			JTextField shopHandling = new JSmartTextField(4);
			JTextArea shopOptions = new JSmartTextArea(10, 40);

			{
				if ( license.length() == 0 ) {
					showShop.setSelected(false);
					commercialMonitor.add(showShop);
				}
				showShop.setToolTipText(texts.getString("ui.sellPhotosInfo"));
				shopGateway.setToolTipText(texts.getString("ui.paymentGatewayInfo"));
				shopId.setToolTipText(texts.getString("ui.sellerIdInfo"));
				shopCurrency.setEditable(true);
				shopCurrency.setToolTipText(texts.getString("ui.currencyInfo"));
				shopHandling.setToolTipText(texts.getString("ui.handlingInfo"));
				shopOptions.setToolTipText(texts.getString("ui.shopOptionsInfo"));
				shopOptions.setText("5x3.75\" Print=0.07\n6x4\" Print=0.1\n6x4.5\" Print=0.15\n7.5x5\" Print=0.3\n9x6\" Print=0.4\n12x8\" Print=1.0\n15x10\" Print=2.0");
				shopOptions.setEditable(true);
				shopOptions.setLineWrap(true);
				shopOptions.setWrapStyleWord(true);

				JScrollPane shopPane = new JScrollPane(shopOptions);
				ComponentUtilities.whenSelectedEnable(showShop, new JComponent[]{shopGateway, shopId, shopCurrency, shopHandling, shopOptions});

				add(showShop);
				add("br", new JLabelFor(texts.getString("ui.paymentGateway"), shopGateway));
				add("tab", shopGateway);
				add("br", new JLabelFor(texts.getString("ui.sellerId"), shopId));
				add("tab hfill", shopId);
				add("br", new JLabelFor(texts.getString("ui.currency"), shopCurrency));
				add("tab", shopCurrency);
				add("br", new JLabelFor(texts.getString("ui.handling"), shopHandling));
				add("tab", shopHandling);
				add("br", new JLabelFor(texts.getString("ui.shopOptions"), shopOptions));
				add("br hfill vfill", shopPane);
			}
		};
		
		ControlPanel av = new ControlPanel() {
			
			JCheckBox videoAutoPlay = new JCheckBox(texts.getString("ui.startVideo"));
			JTextField videoSize = new JSmartTextField("640x480", 10);
			JCheckBox audioAutoPlay = new JCheckBox(texts.getString("ui.startMusic"));

			ControlPanel backgroundAudio = new ControlPanel(texts.getString("ui.backgroundMusic")) {
				JCheckBox useAlbumAudioAsBackground = new JCheckBox(texts.getString("ui.useAlbumAudioAsBackground"));
				JPlaylist playlist = new JPlaylist();
				JCheckBox backgroundAudioAutoPlay = new JCheckBox(texts.getString("ui.autoStart"));
				JCheckBox backgroundAudioLoop = new JCheckBox(texts.getString("ui.loop"));

				{
					ComponentUtilities.whenSelectedDisable(useAlbumAudioAsBackground, new JComponent[]{playlist});
					add(useAlbumAudioAsBackground);
					add("br hfill", playlist);
					add("br", backgroundAudioAutoPlay);
					add("tab", backgroundAudioLoop);
				}
			};
			
			{
				add("", videoAutoPlay);
				add("tab", new JLabel(texts.getString("ui.videoSize")));
				add("", videoSize);
				add("br", audioAutoPlay);
				add("br hfill", backgroundAudio);
			}
		};
		
		ControlPanel advanced = new ControlPanel() {

			JComboBox transitionType = new JComboBox(new Object[] {
				new Item("crossFade", texts.getString("ui.crossFade")),
				new Item("crossFadeAndZoom", texts.getString("ui.crossFadeAndZoom")),
				new Item("none", texts.getString("ui.none"))
			});
			JTextField transitionSpeed = new JSmartTextField("600", 8);
			JCheckBox enableMouseWheel = new JCheckBox(texts.getString("ui.enableMouseWheel"), true);
			JCheckBox enableKeyboard = new JCheckBox(texts.getString("ui.enableKeyboard"), true);
			JCheckBox rightClickProtect = new JCheckBox(texts.getString("ui.rightClickProtect"));
			JTextField watermark = new JSmartTextField();
			JTextField googleSiteID = new JSmartTextField();
			JTextField uploadPath = new JSmartTextField();
			JCheckBox debugMode = new JCheckBox(texts.getString("ui.debugMode"));
			JTextField debugVars = new JSmartTextField();
			
			{
				transitionType.setSelectedIndex(1);
				transitionSpeed.setToolTipText(texts.getString("ui.transitionSpeedInfo"));
				enableMouseWheel.setToolTipText(texts.getString("ui.enableMouseWheelInfo"));
				enableKeyboard.setToolTipText(texts.getString("ui.enableKeyboardInfo"));
				rightClickProtect.setToolTipText(texts.getString("ui.rightClickProtectInfo"));
				watermark.setToolTipText(texts.getString("ui.watermarkInfo"));
				googleSiteID.setToolTipText(texts.getString("ui.googleSiteIDInfo"));
				uploadPath.setToolTipText(texts.getString("ui.uploadPathInfo"));
				ComponentUtilities.whenSelectedEnable(debugMode, new JComponent[]{debugVars});
				add(new JLabelFor(texts.getString("ui.transition"), transitionType));
				add("tab", transitionType);
				add(" ", new JLabelFor(texts.getString("ui.transitionSpeed"), transitionSpeed));
				add(transitionSpeed);
				add(new JLabel("ms"));
				add("br", enableMouseWheel);
				add("br", enableKeyboard);
				add("br", rightClickProtect);
				add("br", new JLabelFor(texts.getString("ui.watermark"), watermark));
				add("tab hfill", watermark);
				add("br", new JLabelFor(texts.getString("ui.googleSiteID"), googleSiteID));
				add("tab hfill", googleSiteID);
				add("br", new JLabelFor(texts.getString("ui.uploadPath"), uploadPath));
				add("tab hfill", uploadPath);
				add("br", debugMode);
				add("br", new JLabelFor(texts.getString("ui.variables"), debugVars));
				add("tab hfill", debugVars);
			}
		};
		
		ControlPanel about = new ControlPanel() {
			
			{
				add("hfill vfill", aboutPanel );
			}
		};
		
		JTabbedPane tabs = new JTabbedPane() {
			
			{ 
				addTab(texts.getString("ui.general"), createImageIcon("general.png"), general);
				addTab(texts.getString("ui.header"), createImageIcon("header.png"), header);
				addTab(texts.getString("ui.footer"), createImageIcon("footer.png"), footer);
				addTab(texts.getString("ui.design"), createImageIcon("design.png"), design);
				addTab(texts.getString("ui.captionTemplates"), createImageIcon("templates.png"), caption);
				addTab(texts.getString("ui.sharing"), createImageIcon("share.png"), share);
				addTab(texts.getString("ui.photoData"), createImageIcon("photodata.png"), photoData);
				addTab(texts.getString("ui.map"), createImageIcon("map.png"), map);
				addTab(texts.getString("ui.sellingPhotos"), createImageIcon("shop.png"), shop);
				addTab(texts.getString("ui.audioVideo"), createImageIcon("av.png"), av);
				addTab(texts.getString("ui.advanced"), createImageIcon("advanced.png"), advanced);
				addTab(texts.getString("ui.about"), about); 
			}
		};
		
		{			
			add("hfill vfill", tabs);
			add("br center", new JLabel("Jalbum " + internalVersion));
			add(new JLinkLabel("http://jalbum.net/software/download/current", texts.getString("ui.upgrade"), texts.getString("ui.downloadJalbum")));
			add(new JLabel("|  " + skin + " skin " + (new SkinProperties(skinDirectory).getProperty(SkinProperties.VERSION))));
			add(new JLinkLabel("http://jalbum.net/skins/skin/" + skin, texts.getString("ui.upgrade"), texts.getString("ui.downloadSkin")));
			add(new JLabel("|"));
			add(new JLinkLabel("file://" + skinDirectory.toString().replace('\\', '/') + "/help/index.html", texts.getString("help")));
			add(new JLabel("|"));
			add(new JLinkLabel("http://jalbum.net/forum/index.jspa?categoryID=1", texts.getString("ui.support")));
		}

		
	};
		
	class CustomUI extends JCustomPanel {

		JTextArea shopOptions = new JSmartTextArea(4, 10);
		JScrollPane shopPane = new JScrollPane(shopOptions);
		JTextField location = new JSmartTextField(10);
		JTextField videoSize = new JSmartTextField(10);

		public CustomUI(JAlbumContext context) {
			super(context);
			setBackground(SystemColor.text);
			setOpaque(true);
			shopOptions.setToolTipText(texts.getString("ui.shopOptionsInfo"));
			shopOptions.setText("");
			shopOptions.setEditable(true);
			shopOptions.setLineWrap(true);
			shopOptions.setWrapStyleWord(true);
			location.setToolTipText(texts.getString("ui.gpsLocationInfo"));

			add(new JLabel(texts.getString("ui.gpsLocation")));
			add("tab hfill", location);
			add("br", new JLabel(texts.getString("ui.shopOptions")));
			add("tab hfill", shopPane);
			add("br", new JLabel(texts.getString("ui.videoSize")));
			add("tab hfill", videoSize);

			FocusListener fl = new FocusAdapter() {
				public void focusLost(FocusEvent e) {
					saveUI();
				}
			};
			
			ActionListener al = new ActionListener() {
				public void actionPerformed(ActionEvent e) {
					saveUI();
				}
			};
			
			shopOptions.addFocusListener(fl);

			init();
		}
	}
	
	public Gui(JAlbumWindow window, JAlbumContext context) {
		super(context.getEngine());
		PluginContext pc = context.getPluginContext();
		EditPanel editPanel = pc.getEditPanel();
		CustomUI customUI = new CustomUI(context);
		editPanel.addCustomTab(texts.getString("ui.imageData"), customUI);

		ui.setBorder(BorderFactory.createEmptyBorder());
		window.setSkinUI(ui);
		window.pack();

	}
		
}
