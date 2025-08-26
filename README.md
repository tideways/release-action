# Create a Tideways Release using GitHub Actions

This action allows to easily create a new Tideways release from within a GitHub
Action Workflow.

## Usage

The available inputs of the `tideways/release-action` match the
[parameters of the “Release Tracking” API](https://support.tideways.com/documentation/setup/configuration/releases.html).

```yml
- uses: tideways/release-action@v1
  with:
    # The project’s API key.
    apiKey: ${{ secrets.TIDEWAYS_API_KEY }}

    # The release name.
    name: 'Released commit ${{ github.sha }}'

    # The release type. Allowed values: release, marker, maintenance, down
    # Default: release
    type: release

    # Optional release description.
    description: ''

    # The environment.
    # Default: The default environment.
    environment: ''

    # The service.
    # Default: The default service.
    service: ''

    # The timeframes around the release for which the performance will be
    # compared. Allow values: 5 - 1440.
    # Default: 90
    compareAfterMinutes: 90
```

## License

The scripts and documentation in this project are released under the
[MIT License](LICENSE)
