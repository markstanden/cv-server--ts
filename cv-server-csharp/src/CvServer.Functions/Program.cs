using CvServer.Functions.Interfaces;
using CvServer.Functions.Models;
using CvServer.Functions.Services;
using CvServer.Functions.Validation;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using RazorLight;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(services =>
    {
        // Register sanitiser (permissive mode allows hyphens and underscores in branch names)
        services.AddSingleton<ISanitiser>(sp => AlphaNumericSanitiser.Permissive());

        // Register GitHub data store (from environment variables)
        services.AddSingleton<IDataStore<Cv>>(sp => GitHubDataStore.CreateFromEnvironment());

        // Register RazorLight template engine
        services.AddSingleton<IRazorLightEngine>(sp =>
        {
            var templatePath = Path.Combine(AppContext.BaseDirectory, "Templates");

            return new RazorLightEngineBuilder()
                .UseFileSystemProject(templatePath)
                .UseMemoryCachingProvider()
                .Build();
        });
    })
    .Build();

await host.RunAsync();
