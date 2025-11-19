# Dependency Parser

A Go-based dependency parser for analyzing and managing project dependencies.

## Overview

This project provides tools for parsing and analyzing dependencies from various project types. It integrates with Git repositories and uses GORM for data persistence.

## Features

- Parse dependencies from multiple project types
- Git repository integration
- Database storage with MySQL support
- YAML configuration support
- Module version management

## Requirements

- Go 1.24.3 or higher
- MySQL database (if using database features)

## Installation

```bash
go get git.woa.com/code/search/parser/dependency
```

## Usage

```go
import "git.woa.com/code/search/parser/dependency"

// Your code here
```

## Dependencies

This project uses the following main dependencies:

- [go-git](https://github.com/go-git/go-git) - Git implementation in Go
- [GORM](https://gorm.io) - ORM library for Go
- [gopom](https://github.com/vifraa/gopom) - Maven POM parser
- [tgit-sdk-go](https://git.code.oa.com/tgit/tgit-sdk-go) - TGit SDK

For a complete list of dependencies, see [go.mod](go.mod).

## Development

### Building

```bash
go build
```

### Testing

```bash
go test ./...
```

## License

Please refer to the project's license file for licensing information.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.
