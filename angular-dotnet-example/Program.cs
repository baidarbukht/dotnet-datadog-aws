using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Extensions.Logging;
using Serilog.Formatting.Json;

namespace angular_dotnet_example
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
        .ConfigureLogging(logging => 
                {   
                    
                    
                    
                    // The JsonFormatter used by NetEscapades.Extensions.Logging.RollingFile includes all properties
                    // if scopes are enabled
                    //
                    // Additions to configuration:
                    // - used json format
                    // - enabled scopes
                    // logging.AddJsonConsole(opts =>
                    // {
                    //     opts.IncludeScopes = true; // must include scopes so that correlation identifiers are added
                    // });
                    
                    logging.AddSerilog(new LoggerConfiguration()
                    .Enrich.FromLogContext()
                    #if DEBUG
                    .WriteTo.Console()
                    .MinimumLevel.Debug()
#else
                    .WriteTo.Console(new JsonFormatter())
#endif
                    .CreateLogger());
                    
				}).ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
		}
						  
}
