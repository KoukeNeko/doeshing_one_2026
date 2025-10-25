---
title: "KoukeNeko Nametag Plugin - Minecraft Tag Management Made Easy"
description: "A Minecraft plugin I built to let players choose their own tags through a simple GUI menu. No more typing complex commands - just click and go. Integrates with LuckPerms and TAB, supports multiple languages, and runs on 1.21+ Paper servers."
tags: ["Java", "Minecraft", "Paper", "Plugin", "GUI", "LuckPerms", "Open Source", "YAML"]
image: "/images/projects/koukeneko-nametag.svg"
github: "https://github.com/KoukeNeko/KoukeNeko-Nametag"
demo: "https://modrinth.com/plugin/koukeneko-nametag-plugin"
date: "2025-04"
featured: true
status: "completed"
---

## What This Is About

I created KoukeNeko Nametag to solve a simple problem: managing player tags on Minecraft servers shouldn't require players to memorize commands or admins to manually assign tags one by one. This plugin puts everything into a clean GUI menu where players can click to select their tags (if they have permission), and admins can manage everything through simple commands.

**Published on Modrinth** with 74+ downloads and counting, running on servers across the Minecraft 1.21+ ecosystem.

## Screenshots

![Tag Selection GUI - Players can click to choose their tags](https://github.com/user-attachments/assets/c5586f29-8247-4b17-85c1-e307e4ebb2fe)

![In-game Display - Tags appear before player names in chat and tab list](https://github.com/user-attachments/assets/28ad0478-b32f-4e7e-9e31-309d237e00e2)

## Why I Built This

Running a Minecraft server, I kept running into the same frustrations:

- Players would ask "how do I change my tag?" and I'd have to explain complex permission commands
- Manual tag assignment meant I was constantly typing the same LuckPerms commands
- Existing tag plugins either lacked GUI interfaces or didn't integrate well with LuckPerms
- I wanted something flexible enough to work with different permission and display plugins
- The config files needed to be simple enough that other server admins could customize without breaking things

So I built this plugin to bridge the gap: powerful permission system on the backend, dead-simple GUI for players on the frontend.

## How It Works

### Tech Stack

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
  <div className="border rounded-lg p-4 dark:border-white/10">
    <h4 className="font-bold mb-2">Built With</h4>
    <ul className="space-y-2 text-sm">
      <li>• <strong>Language:</strong> Java (required for Minecraft plugins)</li>
      <li>• <strong>Platform:</strong> Paper/Spigot 1.21+</li>
      <li>• <strong>API:</strong> Bukkit/Spigot API</li>
      <li>• <strong>Config:</strong> YAML (easy to edit by hand)</li>
      <li>• <strong>Distribution:</strong> Modrinth</li>
    </ul>
  </div>

  <div className="border rounded-lg p-4 dark:border-white/10">
    <h4 className="font-bold mb-2">Integrates With</h4>
    <ul className="space-y-2 text-sm">
      <li>• <strong>Permissions:</strong> LuckPerms (default)</li>
      <li>• <strong>Display:</strong> TAB Plugin (default)</li>
      <li>• <strong>GUI:</strong> Bukkit Inventory API</li>
      <li>• <strong>Storage:</strong> YAML files (no database needed)</li>
    </ul>
  </div>
</div>

### The Flow

Here's what happens when a player uses the plugin:

```
Player types /tag
       ↓
GUI menu opens showing all their available tags
       ↓
Player clicks a tag
       ↓
Plugin checks LuckPerms permissions
       ↓
If allowed, plugin runs TAB commands to set prefix
       ↓
Tag appears in chat and tab list
```

The admin side is similar but streamlined:

- `/tag create <id> <format>` - Creates a new tag in the YAML file
- `/tag <player> add <id>` - Grants permission via LuckPerms console command
- `/kn reload` - Reloads config without restarting the server

### Why Java?

Not much choice here - Minecraft plugins run on the JVM, so Java it is. But that's actually fine because:

- Direct access to Bukkit/Spigot APIs (no wrappers needed)
- Runs anywhere Paper/Spigot runs (cross-platform by default)
- Good performance for real-time player interactions
- Easy integration with other popular plugins like LuckPerms and TAB

## What It Does

### For Players

#### Simple GUI Menu

Just type `/tag` and you get a chest inventory showing all the tags you have permission to use. Click one to apply it, click the barrier to remove it. That's it. No commands to memorize, no syntax to get wrong.

The tags show up in:

- Chat messages (prefix before your name)
- Tab list (that menu when you press Tab)
- Anywhere else the TAB plugin displays names

### For Server Admins

#### Tag Creation

Creating a new tag is one command:

```bash
/tag create mvp &7[&bMVP&7]&f
```

This creates a tag ID called `mvp` that displays as gray brackets with cyan "MVP" text. Minecraft's `&` color codes work here.

#### Permission Management

Give a player access to a tag:

```bash
/tag Steve add mvp
```

Remove access:

```bash
/tag Steve remove mvp
```

The plugin handles the LuckPerms commands behind the scenes, so you don't have to remember the `lp user` syntax.

#### Easy Maintenance

- `/tag remove <tag-id>` - Delete a tag entirely
- `/kn reload` - Reload config without restarting (saves server downtime)
- All online players get notified when their tags change

## Configuration

One thing I focused on was making the config file actually understandable. Everything's in `config.yml` as YAML, which you can edit with any text editor.

### Menu Customization

Want to change the GUI title or layout?

```yaml
menu:
  title: "&8Tag Selection"
  rows: "auto"              # Auto-calculate or set 1-6
  remove_item:
    material: "BARRIER"
    position: "bottom_right"
  tag_item:
    material: "NAME_TAG"
```

### Command Integration

This is where the plugin shines - you can change what commands run when tags are applied. Default setup uses TAB and LuckPerms:

```yaml
command:
  settag:
    - "tab player {player} tagprefix {tag}"
    - "tab player {player} tabprefix {tag}"
  remove:
    - "tab player {player} tagprefix"
    - "tab player {player} tabprefix"
  add_permission:
    - "lp user {player} permission set {tag}"
  remove_permission:
    - "lp user {player} permission unset {tag}"
```

But if you use different plugins, just swap out these commands. The `{player}` and `{tag}` placeholders get replaced automatically.

### Debug Mode

When things break (and they will), flip this on:

```yaml
debug:
  enabled: true
  log_commands: true      # See what commands are being run
  log_permissions: false  # Track permission checks
```

### Multi-Language Support

The plugin speaks Traditional Chinese and English out of the box. All messages are in separate `lang_*.yml` files, so adding a new language is just a matter of copying one and translating.

## Technical Details

### How Permissions Work

The permission system is straightforward:

- `koukeneko.admin` - Gives access to all admin commands
- `koukeneko.tags.<tag-id>` - Grants permission to use a specific tag (e.g., `koukeneko.tags.vip`)

When you use `/tag Steve add vip`, the plugin runs console commands to add the LuckPerms permission. This ensures permissions persist even after server restarts - everything goes through LuckPerms, not stored in a separate database.

### The GUI System

I used Bukkit's Inventory API to create the menu. It's basically a chest interface where:

- Each tag becomes an item (NAME_TAG by default, but configurable)
- Items are only shown if the player has permission
- Rows auto-calculate based on how many tags exist (or you can set it manually)
- Barrier block in the bottom-right removes the current tag

All the Minecraft color codes (`&a`, `&7`, etc.) work in item names and descriptions.

### Data Storage

Everything lives in YAML files - no database needed:

**tags.yml** holds all your tag definitions:

```yaml
tags:
  member:
    display: "&7[&a玩家&7]&f"
  vip:
    display: "&7[&6VIP&7]&f"
  admin:
    display: "&7[&cop&7]&f"
```

Why YAML? Because it's human-readable, easy to edit by hand, works great with Git version control, and the entire Minecraft plugin ecosystem uses it. No reason to reinvent the wheel.

### Integration Strategy

The plugin doesn't directly modify player prefixes - it runs commands through the server console. By default, it uses TAB plugin commands:

```yaml
settag:
  - "tab player {player} tagprefix {tag}"    # Prefix in chat
  - "tab player {player} tabprefix {tag}"    # Prefix in tab list
```

This modular approach means you can swap out TAB for any other prefix plugin just by changing the command strings. The plugin doesn't care what commands it runs, it just replaces `{player}` and `{tag}` with the right values.

## Testing

I tested this mostly manually on my own servers. The testing flow looked like:

1. **GUI Testing** - Opened the menu with different player accounts, some with permissions, some without. Made sure the right tags showed up for each player.

2. **Command Testing** - Ran through all the admin commands to make sure they worked:
   - Creating tags with various color codes
   - Adding/removing permissions
   - Deleting tags and seeing if online players got notified
   - Reloading the config without breaking anything

3. **Integration Testing** - Verified that:
   - LuckPerms permissions actually got set
   - TAB plugin updated the displays correctly
   - Everything survived a server restart
   - The multi-language files loaded properly

### Compatibility

Tested on Paper servers running versions 1.21 through 1.21.5. Should work on Spigot too, but Paper is recommended for better performance. The plugin is server-side only - clients don't need anything installed.

## Installation

Getting it running is straightforward:

1. Download the `.jar` file from [Modrinth](https://modrinth.com/plugin/koukeneko-nametag-plugin)
2. Drop it in your server's `plugins/` folder
3. Restart your server (or `/reload confirm` if you must, though full restart is cleaner)
4. Edit `plugins/KoukeNeko-Nametag/config.yml` and `tags.yml` to your liking
5. Make sure you have LuckPerms and TAB plugin installed (or edit the config to use different ones)

The default config assumes you're using TAB and LuckPerms. If you're using different plugins for prefixes or permissions, just change the command strings in `config.yml`:

```yaml
command:
  settag:
    - "your-plugin-command {player} {tag}"
  add_permission:
    - "your-permission-plugin set {player} {tag}"
```

## Reception

Since publishing on Modrinth in April 2025:

- 74+ downloads so far
- Running on various 1.21+ servers
- Listed under Social and Utility categories
- MIT licensed, so anyone can fork and modify it

The feedback I've gotten has been positive - server admins appreciate the simplified workflow, and players like the GUI approach over typing commands. The flexibility of the command system means it works with different server setups without needing code changes.

## Project Structure

If you want to dive into the code, here's how it's organized:

```
KoukeNeko-Nametag/
├── src/main/
│   ├── java/          # Plugin source code
│   └── resources/
│       ├── plugin.yml # Plugin metadata
│       ├── config.yml # Default config
│       └── tags.yml   # Default tags
├── VERSION_NOTES.md   # Changelog
├── README.md
└── LICENSE (MIT)
```

The language files (`lang_*.yml`) get generated in the plugin folder after first run.

## What I Learned

**On the technical side:**

- Bukkit's Inventory API is surprisingly flexible for building GUIs
- Running commands through console is cleaner than hooking into other plugins directly
- YAML configs hit the sweet spot between power and simplicity
- Modular command system means less feature requests ("can you support X plugin?")

**On the product side:**

- Good UX matters more than cramming in features
- Clear docs = fewer support requests
- Multi-language support from day one is easier than adding it later
- Giving people flexibility in the config means they can adapt it themselves

**On open source:**

- MIT license makes people comfortable using your stuff
- Good installation instructions save you time answering questions
- Keeping it maintained (even small updates) builds trust

## Wrapping Up

This plugin scratched my own itch - I was tired of manually managing tags on my server. Turns out other server admins had the same problem. The key was making it simple enough for players to use themselves, while giving admins the power to customize everything.

The modular design means it works with different permission and display plugins, not just my specific setup. That's made it useful to more people than I expected.

If you run a Minecraft server and deal with player tags, give it a try. It's free, open source, and saves a lot of repetitive work.

---

Download: [Modrinth](https://modrinth.com/plugin/koukeneko-nametag-plugin) | Source: [GitHub](https://github.com/KoukeNeko/KoukeNeko-Nametag)

License: MIT | Platform: Paper/Spigot 1.21+ | Downloads: 74+

Published April 2025
