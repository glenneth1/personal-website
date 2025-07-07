---
title: A Journey Through GNU Guix: From Installation to Returning to Arch Linux
author: Glenn Thompson
date: 2024-07-26 10:30
tags: personal, tech, gnu, guix, swaywm, nvidia
---

# A Journey Through GNU Guix: From Installation to Returning to Arch Linux

As a long-time user of Arch Linux, I decided to explore the world of GNU Guix to see if it could better suit my needs, especially with my growing interest in functional package management. The journey was insightful, filled with learning experiences, but ultimately led me back to the reliable shores of Arch. Here's a detailed account of my venture into GNU Guix, adding non-GNU channels, dealing with Nvidia drivers, running SwayWM, and the eventual retreat to Arch.

## Installation of GNU Guix

The installation process of GNU Guix was straightforward, thanks to the well-documented guide provided on their official website. Here's a quick rundown of the steps I followed:

1. **Downloading the Installation Image**: I started by downloading the latest ISO image from the [GNU Guix website](https://guix.gnu.org/).
2. **Creating a Bootable USB**: Using `dd`, I created a bootable USB stick to install GNU Guix on my system.
3. **Booting into the Installer**: Booting from the USB was smooth, and I was greeted with the GNU Guix installer. The installer's simplicity reminded me of early days with Arch, where a minimalistic approach is preferred.
4. **Partitioning and Setting Up File Systems**: I partitioned my drive using `fdisk` and set up my file systems. I opted for ext4 for simplicity.
5. **Configuring the System**: Following the partition setup, I proceeded to configure my system by selecting the required packages and services. I decided to go with the Sway window manager as it's my preferred choice on Arch.

## System Configuration

During the installation process a window appears informing you that the `config.scm` file is located at `/etc/config.scm`. The first time I installed gnu guix on my work laptop I missed this message (pilot error) and I had to ask in the [System Crafters](https://systemcrafters.net) IRC channel at `irc.libera.chat`, `#systemcrafters`. Come and join. It's a great place to be and the community there are an absolute treasure. Use your favourite IRC client or join through the webchat [here](https://web.libera.chat/?channel=#systemcrafters). We would be glad to see you. Tell them glenneth sent you :).

My point is, I missed some vital information, so to the guix manual online it was. This can be found [here](https://guix.gnu.org/manual/devel/en/guix.html). This link will take you to the dev version of the manual. Something else they don't tell you. This version has a little more detail than the standard manual, and I believe details extra features and may even be a little more up to date.

## Adding Non-GNU Channels

One of the standout features of GNU Guix is the ability to add non-GNU channels to access a wider array of software packages. Here's how I did it:

1. **Editing Channels**: I edited the `~/.config/guix/channels.scm` file to include non-GNU channels.
    ```scheme
    (cons* (channel
            (name 'non-gnu)
            (url "https://example.com/non-gnu-channel.git"))
           %default-channels)
    ```
2. **Updating Channels**: Running `guix pull` updated my system to include packages from the non-GNU channel.

## Installing Nvidia Drivers

Being a gamer and someone who requires GPU acceleration for certain tasks, Nvidia drivers were a must. Here's the process I followed:

1. **Adding Nvidia Channel**: Added a channel that includes Nvidia drivers.
2. **Installing Drivers**: Installed the drivers using `guix package -i nvidia-driver`.
3. **Configuring the System**: I had to manually configure Xorg to use the Nvidia drivers, which involved editing the Xorg configuration files.

## Creating My Home Environment

To personalize my setup further, I used `guix home import` to create my own home environment and add packages. This allowed me to have a consistent environment across different machines. I also edited the `config.scm` file to include the latest Linux kernels and Nvidia drivers.

Additionally, I used the `syncthing home-service-type` in my `home-configuration.scm` file to install and configure Syncthing. This setup ensured my files were always in sync across devices, which is crucial for my workflow.

## GNOME

All was good and I had a solid desktop environment running, even though it was gnome desktop. I had never used gnome, and I am more at home with a keyboard driven workflow. I had come from hyprland on Arch and wanted to get back to that workflow. The option I was presented with, in order to continue using wayland, pipewire etc. was SwayWM.

## Sway

Installing SwayWM and it's dependencies and nice to haves was relatively straightforward. add the required packages, sway, swaybg, swayidle, swaylock, to my home-configuration.scm gile and run `guix home reconfigure` easy! The packages were installed and we were good to go.

The first issue I encountered was that sway does not run with the proprietary nvidia drivers, this was on the work laptop. I could get it to run but only after adding the `--unsupported-gpu` flag to `exec sway`. Lo and behold, we had a default sway window manager running.

## Challenges with SwayWM and SMB Shares

With the system set up, I ran into a major roadblock: accessing SMB shares in a file manager while running SwayWM.

1. **Thunar and GNOME Files**: Neither Thunar nor the GNOME Files application could access SMB shares. This was crucial for my workflow as I frequently access network shares.
2. **Troubleshooting**: I tried various solutions, including installing additional packages and tweaking configurations, but nothing seemed to work.
3. **Community Support**: I reached out to the GNU Guix community for help. While they were supportive, the solutions provided didn't resolve my issues.

To ensure that the problem was not hardware-related, I went out and purchased a Lenovo ThinkPad E16 Gen 1. I upgraded the RAM to 48GB and installed a Lenovo 2TB SSD to make it my personal laptop. However, even on this new setup, I faced the same issues accessing SMB shares and some networking services just wouldn't work.

I tried deleting the `gdm` login manager in my system configuration file, but after rebooting it was still showing the gnome login window. This was after reading somewhere online that sway was not on friendly terms with the gdm login manager.

## Returning to Arch Linux

After several days of troubleshooting and not being able to access my SMB shares reliably, I made the difficult decision to revert to Arch Linux. The steps were:

1. **Reinstalling Arch**: I reinstalled Arch Linux using my tried-and-tested setup process.
2. **Configuring SwayWM**: Set up SwayWM and ensured all my applications were running smoothly.
3. **Accessing SMB Shares**: Accessing SMB shares was seamless, just as it was before my experiment with GNU Guix.

## Conclusion

I am still running GNU guix on the work laptop, I had to cave on my personal laptop and revert to Arch. My journey with GNU Guix was both enlightening and challenging. While I appreciate the functional package management and the philosophy behind GNU Guix, certain practical issues, like accessing SMB shares, were deal-breakers for my workflow. Arch Linux continues to be my go-to distribution, providing the flexibility and reliability I need for my daily tasks. So, at the moment I am using my personal laptop for work and still trying to figure out the issues I am having on my work laptop. But, to be honest, I prefer working on the thinkpad over working on the MSI laptop that work handed out :).

If you're an enthusiast looking to explore new package management paradigms, I highly recommend giving GNU Guix a try. Just be prepared for a few hiccups along the way, and always have a backup plan!

---

Feel free to share your thoughts and experiences with GNU Guix or any other distributions you've tried. Let's keep the conversation going!

## Shameless plug

Go [here](https://systemcrafters.net/community/) to find all the ways you can engage with the SystemCrafters community. It's a great place to hang out and discuss all thing craftery. You will also notice the Craftering ring that I am a part of. Click the links and see blogs by some of the community members. Always interesting to read what other Crafters are up to.

Thanks for taking the time to read my blog post. It is greatly appreciated, and I hope you come back.

Happy Hacking!!
