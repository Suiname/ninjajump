require "bundler"
Bundler.require

# get '/' do
#   return {:hello => 'hello, world'}.to_json
# end

get '/' do
  erb :hello
end
