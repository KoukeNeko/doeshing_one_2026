---
title: "Invade.tw MCP Server - AI-Powered Language Integrity Tool"
description: "Open-source Model Context Protocol server enabling AI assistants to identify Chinese linguistic intrusions and provide Taiwanese Mandarin alternatives. Built with Go for high-performance vocabulary checking and entity database querying."
tags: ["Go", "MCP", "Open Source", "NLP", "Claude Desktop", "API", "YAML", "Database"]
image: "/images/projects/invade-mcp.svg"
github: "https://github.com/caris-events/invade"
demo: "https://github.com/caris-events/invade/pull/15"
date: "2025-10"
featured: true
status: "completed"
---

## Project Overview

A Model Context Protocol (MCP) server that empowers AI assistants like Claude Desktop to identify linguistic intrusions from Chinese Mandarin and suggest appropriate Taiwanese Mandarin alternatives. The server also provides comprehensive information about organizations, brands, and software with connections to Chinese government activities.

**Recognition:** Merged PR #15 to the official invade.tw project, supporting the upcoming community platform launch.

## Motivation

Language preservation and awareness face several challenges in Taiwan:

- **Linguistic Drift:** Gradual adoption of Chinese Mandarin terminology into Taiwanese usage
- **Limited Tooling:** No automated way for AI assistants to identify problematic vocabulary
- **Information Fragmentation:** Data about Chinese-affiliated entities scattered across sources
- **Writer Friction:** Manual vocabulary checking disrupts creative flow

This MCP server bridges the gap between crowdsourced linguistic databases and AI writing assistants, enabling real-time vocabulary checking without leaving the conversation context.

## Technical Architecture

### System Components

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
  <div className="border rounded-lg p-4 dark:border-white/10">
    <h4 className="font-bold mb-2">Core Technology</h4>
    <ul className="space-y-2 text-sm">
      <li>• <strong>Language:</strong> Go 1.21+</li>
      <li>• <strong>Protocol:</strong> Model Context Protocol (MCP)</li>
      <li>• <strong>Library:</strong> mcp-go for server implementation</li>
      <li>• <strong>Data Format:</strong> YAML configuration files</li>
      <li>• <strong>Deployment:</strong> Standalone binary or Docker</li>
    </ul>
  </div>

  <div className="border rounded-lg p-4 dark:border-white/10">
    <h4 className="font-bold mb-2">Integration Points</h4>
    <ul className="space-y-2 text-sm">
      <li>• <strong>Client:</strong> Claude Desktop, Cline, Zed</li>
      <li>• <strong>Data Source:</strong> invade.tw YAML database</li>
      <li>• <strong>Communication:</strong> Standard I/O (stdio)</li>
      <li>• <strong>Testing:</strong> Integration tests + smoke tests</li>
    </ul>
  </div>
</div>

### Why Go?

**Performance Advantages:**

- **Fast Startup:** Quick server initialization
- **Low Memory:** Small RAM footprint
- **Static Binary:** No runtime dependencies
- **Concurrent:** Native goroutines for handling multiple queries

**Development Benefits:**

- **Strong Typing:** Compile-time error detection
- **Simple Deployment:** Single executable file
- **Cross-Platform:** Builds for macOS, Linux, Windows

### MCP Protocol Integration

```
┌──────────────────┐
│  Claude Desktop  │
│                  │
│  User writes:    │
│  "數據庫管理"      │
└────────┬─────────┘
         │ MCP Request
         ▼
┌──────────────────┐
│   MCP Server     │
│   (invade-tw)    │
│                  │
│ ┌──────────────┐ │
│ │ check_vocab  │ │──▶ YAML Database
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │ search_items │ │──▶ Entity DB
│ └──────────────┘ │
└────────┬─────────┘
         │ MCP Response
         ▼
┌──────────────────┐
│  Claude Desktop  │
│                  │
│  Suggests:       │
│  "資料庫管理" ✓    │
└──────────────────┘
```

### Static Site Generation

The project includes a sophisticated static site generator (`cmd/build/`) that transforms YAML database files into the invade.tw website:

**Build Pipeline:**

```text
YAML Files → Compiler → Entity Models → View Generator → HTML/CSS/JS
            ↓
       Serializer → JSON (for client-side search)
            ↓
       Draw → Cover Images (SVG/PNG)
```

**Key Components:**

- **compiler/**: Parses YAML files and builds in-memory database
- **entity/**: Defines data models matching YAML schemas
- **view/**: Generates HTML pages for each item, vocab, category, and search interface
- **draw/**: Creates cover images with item/vocab information
- **serialize/**: Exports data to JSON for browser-based search functionality

This dual-purpose architecture enables both AI integration (via MCP) and human access (via static website) from the same data source.

## Core Features

The MCP server provides **7 tools** organized into two categories:

### Vocabulary Tools (4 tools)

**1. check_vocab** - Proactive vocabulary validation

Special tool designed for LLMs to self-check vocabulary before output. Returns whether a word exists in the invasive vocabulary database and provides alternatives if found.

**2. search_vocabs** - Search the vocabulary database

- Keyword-based search across 374 vocabulary entries
- Filter by category (19 categories: TECHNOLOGY, INTERNET, GAME, etc.)
- Configurable result limits
- Returns full definition and example sentences

**3. get_vocab** - Get detailed information about a specific word

- Includes pronunciation (bopomofo)
- Full description and deprecation reasons
- Correct/incorrect usage examples
- Explicit content warnings (if applicable)

**4. list_vocab_categories** - List all 19 vocabulary categories

- Returns complete category enumeration
- Helps users understand available filters

### Entity Tools (3 tools)

**5. search_items** - Search the entity database

- Query 397 entries (companies, brands, software, games, people)
- Filter by category (24 categories: INTERNET, SOFTWARE, GAME, etc.)
- Filter by type (7 types: COMPANY, PERSON, SOFTWARE, etc.)
- Filter by owner (4 types: CHINESE, TAIWANESE, FOREIGN, HONGKONGESE)
- Filter by invasion level (4 types: MANIPULATED, COLLABORATED, FUNDED, SUPPORTED)

**6. get_item** - Get detailed information about a specific entity

- Full description with [[wiki-style]] cross-references
- Parent company relationships
- Multiple names and aliases
- Website and background information
- Detailed invasion timeline with year and descriptions

**7. list_item_categories** - List all 24 item categories

- Returns complete category enumeration
- Helps users understand available filters

### Real-time Integration

**Seamless AI Workflow:**

```text
User writes → MCP checks vocabulary → Claude suggests alternatives
                                    ↓
                         No context switching required!
```

## Implementation Highlights

### Data Structure Design

**Vocabulary Model:**
```go
type Vocabulary struct {
    Word        string    `yaml:"word"`
    Bopomofo    string    `yaml:"bopomofo"`
    Category    string    `yaml:"category"`
    Explicit    string    `yaml:"explicit"`      // LANGUAGE, SEXUAL
    Description string    `yaml:"description"`
    Deprecation string    `yaml:"deprecation"`
    Notice      string    `yaml:"notice"`
    Examples    []Example `yaml:"examples"`
}

type Example struct {
    Words       []string `yaml:"words"`         // Correct alternatives
    Description string   `yaml:"description"`
    Correct     string   `yaml:"correct"`       // Example usage
    Incorrect   string   `yaml:"incorrect"`     // Counter-example
}
```

**Entity Model:**
```go
type Item struct {
    Code        string        `yaml:"code"`
    ParentCode  string        `yaml:"parent_code"`
    Name        string        `yaml:"name"`
    NameAlias   string        `yaml:"name_alias"`
    NameOthers  []string      `yaml:"name_others"`
    Category    string        `yaml:"category"`      // 24 categories
    Type        string        `yaml:"type"`          // 7 types
    Owner       string        `yaml:"owner"`         // 4 owner types
    Website     string        `yaml:"website"`
    Description string        `yaml:"description"`
    Information []Information `yaml:"information"`
}

type Information struct {
    Invasion    string `yaml:"invasion"`    // MANIPULATED, COLLABORATED, FUNDED, SUPPORTED
    Year        string `yaml:"year"`
    Description string `yaml:"description"`
}
```

### YAML Data Loading

The MCP server loads all YAML files from `database/vocabs/` (374 files) and `database/items/` (397 files) at startup, building in-memory data structures for fast querying.

**Why YAML?**

- Human-readable for community contributions
- Git-friendly diffs for version control
- Easy schema validation
- No build step required for data updates

### MCP Tool Registration

The server registers all 7 tools at startup using the `mcp-go` library and communicates via standard I/O (stdio) as required by the MCP protocol.

## Testing & Quality Assurance

### Manual Testing Approach

The MCP server is tested through:

**1. Claude Desktop Integration Testing:**

- Install server in Claude Desktop configuration
- Test each of the 7 tools through natural language prompts
- Verify correct responses from YAML database
- Check handling of edge cases (missing words, invalid categories)

**2. MCP Inspector Tool:**

- Use official MCP inspector for protocol compliance
- Verify tool schemas and parameter validation
- Test stdio communication channel
- Confirm proper JSON-RPC message formatting

**3. Database Validation:**

- YAML syntax validation on all 771 files (397 items + 374 vocabs)
- Schema compliance checking for required fields
- Cross-reference validation for `[[wiki-links]]`
- Category/type enumeration consistency

### Performance Characteristics

**Observed Runtime Behavior** (approximate, environment-dependent):

- Server initialization: Fast (~50ms on modern hardware)
- Vocabulary lookup: Near-instant (in-memory hash map)
- Entity search: Fast for keyword matching (linear scan of ~400 items)
- Memory footprint: Lightweight (~10MB with full database loaded)

Note: These are observed characteristics during development, not formal benchmarks.

## Deployment

### Claude Desktop Integration

**Configuration (claude_desktop_config.json):**
```json
{
  "mcpServers": {
    "invade-tw": {
      "command": "/path/to/invade-mcp-server",
      "args": [],
      "env": {}
    }
  }
}
```

**Usage Example:**

Users can ask Claude Desktop to check text for invasive vocabulary. Claude will automatically call the MCP server tools to identify problematic terms and suggest Taiwanese Mandarin alternatives.

## Community Impact

### Open Source Contribution

**Pull Request #15 - "Implement the MCP Server":**

- Merged: October 18, 2024
- Adds MCP server implementation with 7 tools
- Core files: `cmd/mcp-server/main.go`, `data.go`, `tools.go`
- Enables AI assistants to query the invade.tw database

**Code Review Feedback:**
> "MCP server would benefit an upcoming community platform launch"
> — YamiOdymel, Project Maintainer

### Database Growth

**Community-Driven:**

- 374 vocabulary entries (as of Oct 2024)
- 397 entity records (as of Oct 2024)
- Active maintenance by core contributors
- Traditional Chinese primary language with English aliases

## Technical Documentation

**Repository Structure:**
```
invade/
├── cmd/
│   ├── build/              # Static site generator
│   │   ├── compiler/       # YAML → Go struct compilation
│   │   ├── entity/         # Data models (item.go, vocab.go)
│   │   ├── view/           # HTML page generation
│   │   ├── draw/           # Cover image generation
│   │   └── serialize/      # JSON serialization for search
│   └── mcp-server/
│       ├── main.go         # MCP server entry point
│       ├── data.go         # Database loading logic
│       └── tools.go        # MCP tool implementations
├── database/
│   ├── items/              # 397 entity YAML files
│   ├── vocabs/             # 374 vocabulary YAML files
│   ├── items_logos/        # Logo images
│   └── news/               # News entries
├── docs/                   # Generated static website
└── go.mod
```

**API Reference:**
- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [Server Implementation Guide](https://github.com/caris-events/invade)
- [Data Schema Documentation](https://github.com/caris-events/invade/wiki)

## Key Learnings

**Technical Insights:**

- MCP protocol provides effective abstraction for AI tool integration
- YAML enables both human editing and machine processing
- Go produces static binaries with no runtime dependencies
- Standard I/O communication works well for local MCP servers

**Open Source Collaboration:**

- Clear PR descriptions help maintainers understand contributions
- Good documentation supports project adoption
- Community-driven databases benefit from accessible data formats

## Conclusion

The invade.tw MCP server demonstrates how modern AI assistants can be augmented with specialized knowledge bases through standardized protocols. By enabling real-time vocabulary checking and entity information lookup, the tool preserves linguistic integrity while maintaining creative flow.

This contribution supports Taiwan's linguistic diversity by making language awareness seamlessly accessible within AI-assisted workflows, serving writers, developers, and content creators across the community.

---

**Project Status:** Merged & Active | [View Pull Request #15](https://github.com/caris-events/invade/pull/15)

**License:** MIT (Code) + CC0 (Data) | **Contributors:** @KoukeNeko + invade.tw community

*Completed October 2024 | Contributing to Taiwan's Linguistic Awareness Initiative*
